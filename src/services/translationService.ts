
/**
 * Decodes basic HTML entities commonly returned by simple translation APIs.
 */
function decodeHtmlEntities(str: string): string {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&#x2F;': '/',
  };
  return str.replace(/&[#\w]+;/g, (match) => map[match] || match);
}

/**
 * Limit concurrency wrapper to handle chunked parallel translations safely
 * without hitting MyMemory API Rate Limits (HTTP 429).
 */
async function limitConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
  onStep?: (completedCount: number, total: number) => void
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;
  let completed = 0;

  const run = async () => {
    while (index < items.length) {
      const currentIndex = index++;
      const item = items[currentIndex];
      try {
        results[currentIndex] = await fn(item, currentIndex);
      } catch (err) {
        console.error(`[translationService] Failed to process index ${currentIndex}`, err);
        // Fallback: use item itself (preserves original text on failure)
        results[currentIndex] = item as unknown as R;
      }
      completed++;
      if (onStep) {
        onStep(completed, items.length);
      }
    }
  };

  const workers = Array.from({ length: Math.min(limit, items.length) }, run);
  await Promise.all(workers);
  return results;
}

/**
 * Splits a long text into smaller sentences/chunks of at most `maxLength` characters.
 * This preserves sentence boundaries for better translation quality.
 */
function splitIntoChunks(text: string, maxLength = 400): string[] {
  if (text.length <= maxLength) return [text];

  // Match sentences ending in punctuation (. ! ?)
  const sentences = text.match(/[^.!?]+[.!?]+(\s+|$)/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxLength) {
      currentChunk += sentence;
    } else {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      
      if (sentence.length > maxLength) {
        // If a single sentence is longer than maxLength, split it by words
        let remaining = sentence;
        while (remaining.length > maxLength) {
          let slicePoint = remaining.lastIndexOf(' ', maxLength);
          if (slicePoint <= 0) slicePoint = maxLength;
          chunks.push(remaining.substring(0, slicePoint).trim());
          remaining = remaining.substring(slicePoint);
        }
        currentChunk = remaining;
      } else {
        currentChunk = sentence;
      }
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Translates a plain text string from Portuguese to English using MyMemory API.
 * Automatically splits texts longer than 400 characters to prevent API size limit errors.
 */
export async function translateText(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return '';

  // Safe limit of 400 characters to prevent MyMemory API query limits
  if (trimmed.length > 400) {
    const chunks = splitIntoChunks(trimmed, 400);
    // Translate chunks in parallel
    const translatedChunks = await Promise.all(chunks.map((chunk) => translateText(chunk)));
    return translatedChunks.join(' ');
  }

  // MyMemory API GET request
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=pt|en`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Serviço de tradução indisponível: HTTP ${response.status}`);
  }

  const data = await response.json();
  const translated = data.responseData?.translatedText;

  if (translated) {
    // Check if the API returned an internal error message inside the translatedText string
    if (
      translated.includes('QUERY LENGTH LIMIT EXCEEDED') ||
      data.responseStatus === 403 ||
      data.responseStatus === 429
    ) {
      throw new Error(data.responseDetails || 'Limite de caracteres ou cota excedidos no MyMemory.');
    }
    return decodeHtmlEntities(translated);
  }
  
  throw new Error(data.responseDetails || 'Erro desconhecido na tradução.');
}

/**
 * Translates an entire Markdown body from Portuguese to English.
 * It parses and preserves structural elements like headers, lists, and images.
 */
export async function translateMarkdown(
  markdown: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  if (!markdown.trim()) return '';

  // Split content by lines
  const lines = markdown.split('\n');

  const translateLine = async (line: string): Promise<string> => {
    const trimmed = line.trim();
    if (!trimmed) return '';

    // Ignore horizontal rules or standard markdown markers without text
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      return line;
    }

    // 1. Image match: ![alt](url) -> translate only the alt text
    const imageMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imageMatch) {
      const alt = imageMatch[1];
      const url = imageMatch[2];
      if (alt.trim()) {
        const translatedAlt = await translateText(alt);
        return `![${translatedAlt}](${url})`;
      }
      return line;
    }

    // 2. Headers match: ### Title -> translate title content only
    const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headerMatch) {
      const hashes = headerMatch[1];
      const content = headerMatch[2];
      if (content.trim()) {
        const translatedContent = await translateText(content);
        return `${hashes} ${translatedContent}`;
      }
      return line;
    }

    // 3. Unordered list match: - Item or * Item -> translate item only
    const listMatch = line.match(/^(\s*[-*+]\s+)(.*)$/);
    if (listMatch) {
      const prefix = listMatch[1];
      const content = listMatch[2];
      if (content.trim()) {
        const translatedContent = await translateText(content);
        return `${prefix}${translatedContent}`;
      }
      return line;
    }

    // 4. Ordered list match: 1. Item -> translate item only
    const orderedListMatch = line.match(/^(\s*\d+\.\s+)(.*)$/);
    if (orderedListMatch) {
      const prefix = orderedListMatch[1];
      const content = orderedListMatch[2];
      if (content.trim()) {
        const translatedContent = await translateText(content);
        return `${prefix}${translatedContent}`;
      }
      return line;
    }

    // 5. Standard line: translate directly
    return translateText(line);
  };

  const onStep = (completed: number, total: number) => {
    if (onProgress) {
      const percent = Math.round((completed / total) * 100);
      onProgress(percent);
    }
  };

  // Translate all lines with a concurrency limit of 3
  const translatedLines = await limitConcurrency(lines, 3, translateLine, onStep);

  return translatedLines.join('\n');
}
