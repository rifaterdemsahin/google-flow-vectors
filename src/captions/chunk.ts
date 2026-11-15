import type { CaptionWord } from './align';

export type CaptionChunk = { words: CaptionWord[]; start: number; end: number };

/** Greedy grouping into short on-screen chunks (<= maxWords words, <= maxChars characters). */
export function chunkWords(words: CaptionWord[], maxWords = 3, maxChars = 22): CaptionChunk[] {
  const chunks: CaptionChunk[] = [];
  let cur: CaptionWord[] = [];
  const flush = () => {
    if (!cur.length) return;
    chunks.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
    cur = [];
  };
  for (const word of words) {
    const joined = [...cur, word].map((x) => x.text).join(' ');
    if (cur.length && (cur.length >= maxWords || joined.length > maxChars)) flush();
    cur.push(word);
  }
  flush();
  return chunks;
}
