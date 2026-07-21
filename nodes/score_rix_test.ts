import { ReadabilityText } from '../gen/messages_pb';
import { scoreRix } from './score_rix';
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

describe('ScoreRix', () => {
  // INDEPENDENT ORACLE -- rix computed from the published formula
  // by hand (see comment below), NOT by calling text-readability and
  // asserting self-consistency.
  // longWords/sentences = 1/3 = 0.33 (same long-word definition as LIX)
  it('ORACLE: matches the published formula hand-computed on a fixed passage', async () => {
    const out = await scoreRix(ctx, req(ORACLE_TEXT));
    expect(out.getError()).toBe('');
    expect(out.getFormula()).toBe('rix');
    expect(out.getScore()).toBeCloseTo(0.33, 2);
  });

  it('DETERMINISM: repeated calls with the same input agree', async () => {
    const a = await scoreRix(ctx, req(ORACLE_TEXT));
    const b = await scoreRix(ctx, req(ORACLE_TEXT));
    expect(a.getScore()).toBe(b.getScore());
  });

  // ── Error path ─────────────────────────────────────────────────────────

  it('ERROR PATH: empty text returns EMPTY_TEXT, not a crash', async () => {
    const out = await scoreRix(ctx, req(''));
    expect(out.getError()).toBe('EMPTY_TEXT');
    expect(out.hasScore()).toBe(false);
  });

  it('ERROR PATH: whitespace-only text returns EMPTY_TEXT', async () => {
    const out = await scoreRix(ctx, req('   \n\t  '));
    expect(out.getError()).toBe('EMPTY_TEXT');
  });

  it('ERROR PATH: oversized text returns TEXT_TOO_LONG', async () => {
    const out = await scoreRix(ctx, req('a '.repeat(MAX_TEXT_CHARS)));
    expect(out.getError()).toBe('TEXT_TOO_LONG');
  });
});
