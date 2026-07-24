import { ReadabilityText } from '../gen/messages_pb';
import { scoreLix } from './score_lix';
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

describe('ScoreLix', () => {
  // INDEPENDENT ORACLE -- lix computed from the published formula
  // by hand (see comment below), NOT by calling text-readability and
  // asserting self-consistency.
  // ASL + 100*longWords/words, where a 'long' word is >6 raw (punctuation-attached) characters. Only 'morning.' (8 chars) qualifies: 6.0 + 100*1/18 = 6.0 + 5.56 = 11.56
  it('ORACLE: matches the published formula hand-computed on a fixed passage', async () => {
    const out = await scoreLix(ctx, req(ORACLE_TEXT));
    expect(out.getError()).toBe('');
    expect(out.getFormula()).toBe('lix');
    expect(out.getScore()).toBeCloseTo(11.56, 2);
  });

  it('DETERMINISM: repeated calls with the same input agree', async () => {
    const a = await scoreLix(ctx, req(ORACLE_TEXT));
    const b = await scoreLix(ctx, req(ORACLE_TEXT));
    expect(a.getScore()).toBe(b.getScore());
  });

  // ── Error path ─────────────────────────────────────────────────────────

  it('ERROR PATH: empty text returns EMPTY_TEXT, not a crash', async () => {
    const out = await scoreLix(ctx, req(''));
    expect(out.getError()).toBe('EMPTY_TEXT');
    expect(out.hasScore()).toBe(false);
  });

  it('ERROR PATH: whitespace-only text returns EMPTY_TEXT', async () => {
    const out = await scoreLix(ctx, req('   \n\t  '));
    expect(out.getError()).toBe('EMPTY_TEXT');
  });

  it('handles a large input without crashing (no payload-length cap)', async () => {
    const out = await scoreLix(ctx, req('a '.repeat(60_000)));
    expect(out.getError()).toBe('');
  });
});
