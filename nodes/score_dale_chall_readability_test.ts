import { ReadabilityText } from '../gen/messages_pb';
import { scoreDaleChallReadability } from './score_dale_chall_readability';
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

describe('ScoreDaleChallReadability', () => {
  // INDEPENDENT ORACLE -- dale_chall_readability_score computed from the published formula
  // by hand (see comment below), NOT by calling text-readability and
  // asserting self-consistency.
  // 0.1579*difficultPct + 0.0496*ASL (+3.6365 if difficultPct>5). Exactly one word ('morning', the only word with 2+ syllables) is difficult: difficultPct=100*1/18=5.56%: 0.1579*5.56 + 0.0496*6.0 + 3.6365 = 0.878+0.298+3.6365 = 4.81
  it('ORACLE: matches the published formula hand-computed on a fixed passage', async () => {
    const out = await scoreDaleChallReadability(ctx, req(ORACLE_TEXT));
    expect(out.getError()).toBe('');
    expect(out.getFormula()).toBe('dale_chall_readability_score');
    expect(out.getScore()).toBeCloseTo(4.81, 2);
  });

  it('DETERMINISM: repeated calls with the same input agree', async () => {
    const a = await scoreDaleChallReadability(ctx, req(ORACLE_TEXT));
    const b = await scoreDaleChallReadability(ctx, req(ORACLE_TEXT));
    expect(a.getScore()).toBe(b.getScore());
  });

  // ── Error path ─────────────────────────────────────────────────────────

  it('ERROR PATH: empty text returns EMPTY_TEXT, not a crash', async () => {
    const out = await scoreDaleChallReadability(ctx, req(''));
    expect(out.getError()).toBe('EMPTY_TEXT');
    expect(out.hasScore()).toBe(false);
  });

  it('ERROR PATH: whitespace-only text returns EMPTY_TEXT', async () => {
    const out = await scoreDaleChallReadability(ctx, req('   \n\t  '));
    expect(out.getError()).toBe('EMPTY_TEXT');
  });

  it('ERROR PATH: oversized text returns TEXT_TOO_LONG', async () => {
    const out = await scoreDaleChallReadability(ctx, req('a '.repeat(MAX_TEXT_CHARS)));
    expect(out.getError()).toBe('TEXT_TOO_LONG');
  });
});
