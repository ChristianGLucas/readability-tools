import { ReadabilityText } from '../gen/messages_pb';
import { scoreColemanLiauIndex } from './score_coleman_liau_index';
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

describe('ScoreColemanLiauIndex', () => {
  // INDEPENDENT ORACLE -- coleman_liau_index computed from the published formula
  // by hand (see comment below), NOT by calling text-readability and
  // asserting self-consistency.
  // 0.058*L - 0.296*S - 15.8, L=100*letters/words rounded (100*65/18=361.11->361.0 at the library's own 2dp-then-cast intermediate step), S=100*sentences/words rounded (100*3/18=16.67->17.0): 0.058*361.0 - 0.296*17.0 - 15.8 = 20.938 - 5.032 - 15.8 = 0.106 -> 0.11
  it('ORACLE: matches the published formula hand-computed on a fixed passage', async () => {
    const out = await scoreColemanLiauIndex(ctx, req(ORACLE_TEXT));
    expect(out.getError()).toBe('');
    expect(out.getFormula()).toBe('coleman_liau_index');
    expect(out.getScore()).toBeCloseTo(0.11, 2);
  });

  it('DETERMINISM: repeated calls with the same input agree', async () => {
    const a = await scoreColemanLiauIndex(ctx, req(ORACLE_TEXT));
    const b = await scoreColemanLiauIndex(ctx, req(ORACLE_TEXT));
    expect(a.getScore()).toBe(b.getScore());
  });

  // ── Error path ─────────────────────────────────────────────────────────

  it('ERROR PATH: empty text returns EMPTY_TEXT, not a crash', async () => {
    const out = await scoreColemanLiauIndex(ctx, req(''));
    expect(out.getError()).toBe('EMPTY_TEXT');
    expect(out.hasScore()).toBe(false);
  });

  it('ERROR PATH: whitespace-only text returns EMPTY_TEXT', async () => {
    const out = await scoreColemanLiauIndex(ctx, req('   \n\t  '));
    expect(out.getError()).toBe('EMPTY_TEXT');
  });

  it('handles a large input without crashing (no payload-length cap)', async () => {
    const out = await scoreColemanLiauIndex(ctx, req('a '.repeat(60_000)));
    expect(out.getError()).toBe('');
  });
});
