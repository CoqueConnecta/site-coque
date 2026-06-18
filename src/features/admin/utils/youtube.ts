export function extractYouTubeId(input: string): string | null {
  const s = input.trim();
  // Already a clean 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;

  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,       // youtube.com/watch?v=ID
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,  // youtu.be/ID
    /\/embed\/([a-zA-Z0-9_-]{11})/,    // /embed/ID
    /\/shorts\/([a-zA-Z0-9_-]{11})/,   // /shorts/ID
    /\/v\/([a-zA-Z0-9_-]{11})/,        // /v/ID
  ];

  for (const p of patterns) {
    const m = s.match(p);
    if (m) return m[1];
  }
  return null;
}
