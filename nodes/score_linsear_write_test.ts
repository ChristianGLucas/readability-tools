import { ReadabilityText } from '../gen/messages_pb';
import { scoreLinsearWrite } from './score_linsear_write';
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

describe('ScoreLinsearWrite', () => {
  // INDEPENDENT ORACLE -- linsear_write_formula computed from the published formula
  // by hand (see comment below), NOT by calling text-readability and
  // asserting self-consistency.
  // All 18 words (<=100) score as 'easy' (<3 syllables): (18*1 + 0*3)/sentences(3) = 6.0; since 6<=20: (6-2)/2 = 2
  it('ORACLE: matches the published formula hand-computed on a fixed passage', async () => {
    const out = await scoreLinsearWrite(ctx, req(ORACLE_TEXT));
    expect(out.getError()).toBe('');
    expect(out.getFormula()).toBe('linsear_write_formula');
    expect(out.getScore()).toBeCloseTo(2, 1);
  });

  it('DETERMINISM: repeated calls with the same input agree', async () => {
    const a = await scoreLinsearWrite(ctx, req(ORACLE_TEXT));
    const b = await scoreLinsearWrite(ctx, req(ORACLE_TEXT));
    expect(a.getScore()).toBe(b.getScore());
  });

  // ── Error path ─────────────────────────────────────────────────────────

  it('ERROR PATH: empty text returns EMPTY_TEXT, not a crash', async () => {
    const out = await scoreLinsearWrite(ctx, req(''));
    expect(out.getError()).toBe('EMPTY_TEXT');
    expect(out.hasScore()).toBe(false);
  });

  it('ERROR PATH: whitespace-only text returns EMPTY_TEXT', async () => {
    const out = await scoreLinsearWrite(ctx, req('   \n\t  '));
    expect(out.getError()).toBe('EMPTY_TEXT');
  });

  it('handles a large input without crashing (no payload-length cap)', async () => {
    const out = await scoreLinsearWrite(ctx, req('a '.repeat(60_000)));
    expect(out.getError()).toBe('');
  });
});
