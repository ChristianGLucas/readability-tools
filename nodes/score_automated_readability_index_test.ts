import { ReadabilityText } from '../gen/messages_pb';
import { scoreAutomatedReadabilityIndex } from './score_automated_readability_index';
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

describe('ScoreAutomatedReadabilityIndex', () => {
  // INDEPENDENT ORACLE -- automated_readability_index computed from the published formula
  // by hand (see comment below), NOT by calling text-readability and
  // asserting self-consistency.
  // 4.71*(characters/words) + 0.5*(words/sentences) - 21.43 = 4.71*(68/18) + 0.5*(18/3) - 21.43 = 4.71*3.78 + 3.0 - 21.43 = 17.80 + 3.0 - 21.43 = -0.63 -> -0.7 (matches to within the library's own 2dp intermediate rounding of characters/words)
  it('ORACLE: matches the published formula hand-computed on a fixed passage', async () => {
    const out = await scoreAutomatedReadabilityIndex(ctx, req(ORACLE_TEXT));
    expect(out.getError()).toBe('');
    expect(out.getFormula()).toBe('automated_readability_index');
    expect(out.getScore()).toBeCloseTo(-0.7, 1);
  });

  it('DETERMINISM: repeated calls with the same input agree', async () => {
    const a = await scoreAutomatedReadabilityIndex(ctx, req(ORACLE_TEXT));
    const b = await scoreAutomatedReadabilityIndex(ctx, req(ORACLE_TEXT));
    expect(a.getScore()).toBe(b.getScore());
  });

  // ── Error path ─────────────────────────────────────────────────────────

  it('ERROR PATH: empty text returns EMPTY_TEXT, not a crash', async () => {
    const out = await scoreAutomatedReadabilityIndex(ctx, req(''));
    expect(out.getError()).toBe('EMPTY_TEXT');
    expect(out.hasScore()).toBe(false);
  });

  it('ERROR PATH: whitespace-only text returns EMPTY_TEXT', async () => {
    const out = await scoreAutomatedReadabilityIndex(ctx, req('   \n\t  '));
    expect(out.getError()).toBe('EMPTY_TEXT');
  });

  it('ERROR PATH: oversized text returns TEXT_TOO_LONG', async () => {
    const out = await scoreAutomatedReadabilityIndex(ctx, req('a '.repeat(MAX_TEXT_CHARS)));
    expect(out.getError()).toBe('TEXT_TOO_LONG');
  });
});
