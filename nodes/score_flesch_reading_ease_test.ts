import { ReadabilityText } from '../gen/messages_pb';
import { scoreFleschReadingEase } from './score_flesch_reading_ease';
import { ctx } from './testkit';
import { MAX_TEXT_CHARS } from './readability_helper';

function req(text: string): ReadabilityText {
  const input = new ReadabilityText();
  input.setText(text);
  return input;
}

// Shared fixed oracle passage, hand/independently derived (see readability_helper
// tests + axiom.yaml): 18 words, 3 sentences, 19 syllables, 68 non-space chars,
// 65 letters. Only "morning" (2 syllables) is not monosyllabic; none of the 18
// words has 3+ syllables.
const ORACLE_TEXT =
  'The cat sat on the mat. The dog ran in the yard. Birds sing sweet songs each morning.';

describe('ScoreFleschReadingEase', () => {
  // INDEPENDENT ORACLE -- flesch_reading_ease computed from the published formula
  // by hand (see comment below), NOT by calling text-readability and
  // asserting self-consistency.
  // 206.835 - 1.015*ASL - 84.6*ASW, where ASL=words/sentences rounded to 1dp (18/3=6.0) and ASW=syllables/words rounded to 1dp (19/18=1.0556 -> 1.1): 206.835 - 1.015*6.0 - 84.6*1.1 = 206.835 - 6.09 - 93.06 = 107.685 -> 107.69
  it('ORACLE: matches the published formula hand-computed on a fixed passage', async () => {
    const out = await scoreFleschReadingEase(ctx, req(ORACLE_TEXT));
    expect(out.getError()).toBe('');
    expect(out.getFormula()).toBe('flesch_reading_ease');
    expect(out.getScore()).toBeCloseTo(107.69, 2);
  });

  it('DETERMINISM: repeated calls with the same input agree', async () => {
    const a = await scoreFleschReadingEase(ctx, req(ORACLE_TEXT));
    const b = await scoreFleschReadingEase(ctx, req(ORACLE_TEXT));
    expect(a.getScore()).toBe(b.getScore());
  });

  // ── Error path ─────────────────────────────────────────────────────────

  it('ERROR PATH: empty text returns EMPTY_TEXT, not a crash', async () => {
    const out = await scoreFleschReadingEase(ctx, req(''));
    expect(out.getError()).toBe('EMPTY_TEXT');
    expect(out.hasScore()).toBe(false);
  });

  it('ERROR PATH: whitespace-only text returns EMPTY_TEXT', async () => {
    const out = await scoreFleschReadingEase(ctx, req('   \n\t  '));
    expect(out.getError()).toBe('EMPTY_TEXT');
  });

  it('ERROR PATH: oversized text returns TEXT_TOO_LONG', async () => {
    const out = await scoreFleschReadingEase(ctx, req('a '.repeat(MAX_TEXT_CHARS)));
    expect(out.getError()).toBe('TEXT_TOO_LONG');
  });
});
