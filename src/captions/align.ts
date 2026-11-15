export type CaptionWord = { text: string; start: number; end: number };

/** Split script text into display words (whitespace and em-dash boundaries; punctuation stays attached). */
export function tokenize(text: string): string[] {
  return text.replace(/—/g, '— ').split(/\s+/).filter(Boolean);
}

const len = (s: string) => Math.max(1, s.toLowerCase().replace(/[^a-z0-9]/g, '').length);

/**
 * Give each script word a timing taken from Whisper's word timeline.
 * Script words are always the displayed text (Whisper may mishear); only timing comes from Whisper.
 * Equal word counts map 1:1; otherwise timing is interpolated by character position.
 */
export function mapToScript(scriptWords: string[], whisper: CaptionWord[]): CaptionWord[] {
  if (scriptWords.length === whisper.length) {
    return scriptWords.map((text, i) => ({ text, start: whisper[i].start, end: whisper[i].end }));
  }
  // Whisper timeline in character space
  const spans: { a: number; b: number; s: number; e: number }[] = [];
  let acc = 0;
  for (const w of whisper) {
    const l = len(w.text);
    spans.push({ a: acc, b: acc + l, s: w.start, e: w.end });
    acc += l;
  }
  const totalW = acc;
  const timeAt = (p: number): number => {
    const sp = spans.find((x) => p <= x.b) ?? spans[spans.length - 1];
    const f = sp.b === sp.a ? 0 : Math.min(1, Math.max(0, (p - sp.a) / (sp.b - sp.a)));
    return sp.s + f * (sp.e - sp.s);
  };
  const totalS = scriptWords.reduce((n, w) => n + len(w), 0);
  let cum = 0;
  return scriptWords.map((text) => {
    const p0 = (cum / totalS) * totalW;
    cum += len(text);
    const p1 = (cum / totalS) * totalW;
    const start = timeAt(p0);
    return { text, start, end: Math.max(start, timeAt(p1)) };
  });
}
