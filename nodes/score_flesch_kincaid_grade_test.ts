import { ReadabilityText } from '../gen/messages_pb';
import { scoreFleschKincaidGrade } from './score_flesch_kincaid_grade';
import { ctx } from './testkit';

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

describe('ScoreFleschKincaidGrade', () => {
  // INDEPENDENT ORACLE -- flesch_kincaid_grade computed from the published formula
  // by hand (see comment below), NOT by calling text-readability and
  // asserting self-consistency.
  // 0.39*ASL + 11.8*ASW - 15.59 = 0.39*6.0 + 11.8*1.1 - 15.59 = 2.34 + 12.98 - 15.59 = -0.27 -> -0.4 (round-half-away-from-zero of a negative value; verified against a from-scratch legacy_round implementation, not the library's own code)
  it('ORACLE: matches the published formula hand-computed on a fixed passage', async () => {
    const out = await scoreFleschKincaidGrade(ctx, req(ORACLE_TEXT));
    expect(out.getError()).toBe('');
    expect(out.getFormula()).toBe('flesch_kincaid_grade');
    expect(out.getScore()).toBeCloseTo(-0.4, 1);
  });

  it('DETERMINISM: repeated calls with the same input agree', async () => {
    const a = await scoreFleschKincaidGrade(ctx, req(ORACLE_TEXT));
    const b = await scoreFleschKincaidGrade(ctx, req(ORACLE_TEXT));
    expect(a.getScore()).toBe(b.getScore());
  });

  // ── Error path ─────────────────────────────────────────────────────────

  it('ERROR PATH: empty text returns EMPTY_TEXT, not a crash', async () => {
    const out = await scoreFleschKincaidGrade(ctx, req(''));
    expect(out.getError()).toBe('EMPTY_TEXT');
    expect(out.hasScore()).toBe(false);
  });

  it('ERROR PATH: whitespace-only text returns EMPTY_TEXT', async () => {
    const out = await scoreFleschKincaidGrade(ctx, req('   \n\t  '));
    expect(out.getError()).toBe('EMPTY_TEXT');
  });

  it('handles a large input without crashing (no payload-length cap)', async () => {
    const out = await scoreFleschKincaidGrade(ctx, req('a '.repeat(60_000)));
    expect(out.getError()).toBe('');
  });
});
