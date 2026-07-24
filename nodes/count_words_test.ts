import { ReadabilityText } from '../gen/messages_pb';
import { countWords } from './count_words';
import { ctx } from './testkit';

function req(text: string): ReadabilityText {
  const input = new ReadabilityText();
  input.setText(text);
  return input;
}

const ORACLE_TEXT =
  'The cat sat on the mat. The dog ran in the yard. Birds sing sweet songs each morning.';

describe('CountWords', () => {
  // INDEPENDENT ORACLE -- counted by hand: "The cat sat on the mat" (6) +
  // "The dog ran in the yard" (6) + "Birds sing sweet songs each morning"
  // (6) = 18 whitespace-delimited words.
  it('ORACLE: counts hand-tallied words', async () => {
    const out = await countWords(ctx, req(ORACLE_TEXT));
    expect(out.getError()).toBe('');
    expect(out.getWordCount()).toBe(18);
  });

  it('a classic pangram counts exactly 9 words', async () => {
    const out = await countWords(ctx, req('The quick brown fox jumps over the lazy dog.'));
    expect(out.getWordCount()).toBe(9);
  });

  it('DETERMINISM: repeated calls agree', async () => {
    const a = await countWords(ctx, req(ORACLE_TEXT));
    const b = await countWords(ctx, req(ORACLE_TEXT));
    expect(a.getWordCount()).toBe(b.getWordCount());
  });

  // ── Error path ─────────────────────────────────────────────────────────

  it('ERROR PATH: empty text returns EMPTY_TEXT', async () => {
    const out = await countWords(ctx, req(''));
    expect(out.getError()).toBe('EMPTY_TEXT');
    expect(out.hasWordCount()).toBe(false);
  });

  it('handles a large input without crashing (no payload-length cap)', async () => {
    const out = await countWords(ctx, req('a '.repeat(60_000)));
    expect(out.getError()).toBe('');
  });
});
