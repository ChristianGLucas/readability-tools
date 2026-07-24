import { ReadabilityText } from '../gen/messages_pb';
import { scoreSmogIndex } from './score_smog_index';
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

describe('ScoreSmogIndex', () => {
  // INDEPENDENT ORACLE -- smog_index computed from the published formula
  // by hand (see comment below), NOT by calling text-readability and
  // asserting self-consistency.
  // 1.043*sqrt(30*polysyllableWords/sentences) + 3.1291. No word has 3+ syllables, so polysyllableWords=0: 1.043*sqrt(0) + 3.1291 = 3.1291 -> 3.1
  it('ORACLE: matches the published formula hand-computed on a fixed passage', async () => {
    const out = await scoreSmogIndex(ctx, req(ORACLE_TEXT));
    expect(out.getError()).toBe('');
    expect(out.getFormula()).toBe('smog_index');
    expect(out.getScore()).toBeCloseTo(3.1, 1);
  });

  it('DETERMINISM: repeated calls with the same input agree', async () => {
    const a = await scoreSmogIndex(ctx, req(ORACLE_TEXT));
    const b = await scoreSmogIndex(ctx, req(ORACLE_TEXT));
    expect(a.getScore()).toBe(b.getScore());
  });

  // ── Error path ─────────────────────────────────────────────────────────

  it('ERROR PATH: empty text returns EMPTY_TEXT, not a crash', async () => {
    const out = await scoreSmogIndex(ctx, req(''));
    expect(out.getError()).toBe('EMPTY_TEXT');
    expect(out.hasScore()).toBe(false);
  });

  it('ERROR PATH: whitespace-only text returns EMPTY_TEXT', async () => {
    const out = await scoreSmogIndex(ctx, req('   \n\t  '));
    expect(out.getError()).toBe('EMPTY_TEXT');
  });

  it('handles a large input without crashing (no payload-length cap)', async () => {
    const out = await scoreSmogIndex(ctx, req('a '.repeat(60_000)));
    expect(out.getError()).toBe('');
  });
});
