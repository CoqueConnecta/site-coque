
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
 * Translates a plain text string from Portuguese to English using MyMemory API.
 */
export async function translateText(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return '';

  // MyMemory API GET request
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=pt|en`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Serviço de tradução indisponível: HTTP ${response.status}`);
  }

  const data = await response.json();
  if (data.responseData?.translatedText) {
    return decodeHtmlEntities(data.responseData.translatedText);
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
