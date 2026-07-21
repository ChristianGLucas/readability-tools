import { ReadabilityText } from '../gen/messages_pb';
import { countSentences } from './count_sentences';
import { ctx } from './testkit';
import { MAX_TEXT_CHARS } from './readability_helper';

function req(text: string): ReadabilityText {
  const input = new ReadabilityText();
  input.setText(text);
  return input;
}

const ORACLE_TEXT =
  'The cat sat on the mat. The dog ran in the yard. Birds sing sweet songs each morning.';

describe('CountSentences', () => {
  // INDEPENDENT ORACLE -- 3 sentences, each ending in "." followed by a
  // space and a capital letter (or end of string for the last one), and
  // each with 6 words (well above the library's 2-word "not a real
  // sentence" cutoff used to avoid miscounting abbreviations).
  it('ORACLE: counts 3 hand-tallied sentences', async () => {
    const out = await countSentences(ctx, req(ORACLE_TEXT));
    expect(out.getError()).toBe('');
    expect(out.getSentenceCount()).toBe(3);
  });

  // A known sharp edge in the wrapped library's sentence-boundary
  // heuristic, documented here so it's a recorded decision, not a
  // surprise: very short "sentences" (<=2 words) are treated as
  // abbreviations, not sentence boundaries, and folded into one.
  it('very short pseudo-sentences collapse to a single sentence (library heuristic)', async () => {
    const out = await countSentences(ctx, req('One. Two. Three.'));
    expect(out.getSentenceCount()).toBe(1);
  });

  it('DETERMINISM: repeated calls agree', async () => {
    const a = await countSentences(ctx, req(ORACLE_TEXT));
    const b = await countSentences(ctx, req(ORACLE_TEXT));
    expect(a.getSentenceCount()).toBe(b.getSentenceCount());
  });

  // ── Error path ─────────────────────────────────────────────────────────

  it('ERROR PATH: empty text returns EMPTY_TEXT', async () => {
    const out = await countSentences(ctx, req(''));
    expect(out.getError()).toBe('EMPTY_TEXT');
    expect(out.hasSentenceCount()).toBe(false);
  });

  it('ERROR PATH: oversized text returns TEXT_TOO_LONG', async () => {
    const out = await countSentences(ctx, req('a'.repeat(MAX_TEXT_CHARS + 1)));
    expect(out.getError()).toBe('TEXT_TOO_LONG');
  });
});
