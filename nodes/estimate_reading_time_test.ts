import { ReadabilityText } from '../gen/messages_pb';
import { estimateReadingTime } from './estimate_reading_time';
import { ctx } from './testkit';
import { MAX_TEXT_CHARS } from './readability_helper';

function req(text: string, wpm?: number): ReadabilityText {
  const input = new ReadabilityText();
  input.setText(text);
  if (wpm !== undefined) input.setWordsPerMinute(wpm);
  return input;
}

const ORACLE_TEXT =
  'The cat sat on the mat. The dog ran in the yard. Birds sing sweet songs each morning.';

describe('EstimateReadingTime', () => {
  // INDEPENDENT ORACLE -- this node's own arithmetic (word_count / wpm),
  // not a text-readability call: 18 words / 200 wpm (default) = 0.09
  // minutes = 5.4 seconds, rounded UP to 6 whole seconds.
  it('ORACLE: 18 words at the default 200 wpm is 0.09 minutes / 6 seconds', async () => {
    const out = await estimateReadingTime(ctx, req(ORACLE_TEXT));
    expect(out.getError()).toBe('');
    expect(out.getMinutes()).toBeCloseTo(0.09, 5);
    expect(out.getSeconds()).toBe(6);
    expect(out.getWordsPerMinute()).toBe(200);
  });

  // INDEPENDENT ORACLE -- 18 words / 60 wpm = 0.3 minutes = 18 seconds
  // exactly (no rounding ambiguity, a clean check of the caller-supplied
  // wpm path).
  it('ORACLE: a caller-supplied words_per_minute changes the estimate', async () => {
    const out = await estimateReadingTime(ctx, req(ORACLE_TEXT, 60));
    expect(out.getMinutes()).toBeCloseTo(0.3, 5);
    expect(out.getSeconds()).toBe(18);
    expect(out.getWordsPerMinute()).toBe(60);
  });

  it('DETERMINISM: repeated calls agree', async () => {
    const a = await estimateReadingTime(ctx, req(ORACLE_TEXT));
    const b = await estimateReadingTime(ctx, req(ORACLE_TEXT));
    expect(a.getSeconds()).toBe(b.getSeconds());
  });

  // ── Error path ─────────────────────────────────────────────────────────

  it('ERROR PATH: empty text returns EMPTY_TEXT', async () => {
    const out = await estimateReadingTime(ctx, req(''));
    expect(out.getError()).toBe('EMPTY_TEXT');
  });

  it('ERROR PATH: oversized text returns TEXT_TOO_LONG', async () => {
    const out = await estimateReadingTime(ctx, req('a'.repeat(MAX_TEXT_CHARS + 1)));
    expect(out.getError()).toBe('TEXT_TOO_LONG');
  });

  it('ERROR PATH: words_per_minute of 10 returns INVALID_WORDS_PER_MINUTE', async () => {
    const out = await estimateReadingTime(ctx, req(ORACLE_TEXT, 10));
    expect(out.getError()).toBe('INVALID_WORDS_PER_MINUTE');
  });

  it('ERROR PATH: words_per_minute of 5000 returns INVALID_WORDS_PER_MINUTE', async () => {
    const out = await estimateReadingTime(ctx, req(ORACLE_TEXT, 5000));
    expect(out.getError()).toBe('INVALID_WORDS_PER_MINUTE');
  });
});
