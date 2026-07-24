import { ReadabilityText } from '../gen/messages_pb';
import { scoreGunningFog } from './score_gunning_fog';
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

describe('ScoreGunningFog', () => {
  // INDEPENDENT ORACLE -- gunning_fog computed from the published formula
  // by hand (see comment below), NOT by calling text-readability and
  // asserting self-consistency.
  // 0.4*(ASL + 100*complexWords/words). No word in the passage has 3+ syllables (the longest is 'morning' at 2), so complexWords=0: 0.4*(6.0+0) = 2.4
  it('ORACLE: matches the published formula hand-computed on a fixed passage', async () => {
    const out = await scoreGunningFog(ctx, req(ORACLE_TEXT));
    expect(out.getError()).toBe('');
    expect(out.getFormula()).toBe('gunning_fog');
    expect(out.getScore()).toBeCloseTo(2.4, 2);
  });

  it('DETERMINISM: repeated calls with the same input agree', async () => {
    const a = await scoreGunningFog(ctx, req(ORACLE_TEXT));
    const b = await scoreGunningFog(ctx, req(ORACLE_TEXT));
    expect(a.getScore()).toBe(b.getScore());
  });

  // ── Error path ─────────────────────────────────────────────────────────

  it('ERROR PATH: empty text returns EMPTY_TEXT, not a crash', async () => {
    const out = await scoreGunningFog(ctx, req(''));
    expect(out.getError()).toBe('EMPTY_TEXT');
    expect(out.hasScore()).toBe(false);
  });

  it('ERROR PATH: whitespace-only text returns EMPTY_TEXT', async () => {
    const out = await scoreGunningFog(ctx, req('   \n\t  '));
    expect(out.getError()).toBe('EMPTY_TEXT');
  });

  it('handles a large input without crashing (no payload-length cap)', async () => {
    const out = await scoreGunningFog(ctx, req('a '.repeat(60_000)));
    expect(out.getError()).toBe('');
  });
});
