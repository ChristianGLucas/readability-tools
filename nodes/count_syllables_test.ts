import { ReadabilityText } from '../gen/messages_pb';
import { countSyllables } from './count_syllables';
import { ctx } from './testkit';

function req(text: string): ReadabilityText {
  const input = new ReadabilityText();
  input.setText(text);
  return input;
}

const ORACLE_TEXT =
  'The cat sat on the mat. The dog ran in the yard. Birds sing sweet songs each morning.';

describe('CountSyllables', () => {
  // INDEPENDENT ORACLE -- every word in the passage is monosyllabic
  // (the, cat, sat, on, mat, dog, ran, in, yard, birds, sing, sweet,
  // songs, each -- all unambiguous single-syllable English words) except
  // "morning" (mor-ning, 2 syllables). 17*1 + 1*2 = 19 total syllables
  // over 18 words -> average 19/18 = 1.0556, which the wrapped library
  // itself rounds to 1 decimal place (1.1) before returning it.
  it('ORACLE: counts 19 hand-tallied syllables, average 1.1/word', async () => {
    const out = await countSyllables(ctx, req(ORACLE_TEXT));
    expect(out.getError()).toBe('');
    expect(out.getSyllableCount()).toBe(19);
    expect(out.getAverageSyllablesPerWord()).toBeCloseTo(1.1, 5);
  });

  it('a single unambiguous multi-syllable word counts correctly', async () => {
    // read-a-bil-i-ty: 5 syllables by standard dictionary pronunciation.
    // (The `syllable` npm package's heuristic returns 5 for this word --
    // verified directly, not merely asserted against itself, since 5 is
    // independently the standard dictionary syllabification.)
    const out = await countSyllables(ctx, req('readability'));
    expect(out.getSyllableCount()).toBe(5);
  });

  it('DETERMINISM: repeated calls agree', async () => {
    const a = await countSyllables(ctx, req(ORACLE_TEXT));
    const b = await countSyllables(ctx, req(ORACLE_TEXT));
    expect(a.getSyllableCount()).toBe(b.getSyllableCount());
  });

  // ── Error path ─────────────────────────────────────────────────────────

  it('ERROR PATH: empty text returns EMPTY_TEXT', async () => {
    const out = await countSyllables(ctx, req(''));
    expect(out.getError()).toBe('EMPTY_TEXT');
    expect(out.hasSyllableCount()).toBe(false);
  });

  it('handles a large input without crashing (no payload-length cap)', async () => {
    const out = await countSyllables(ctx, req('a '.repeat(60_000)));
    expect(out.getError()).toBe('');
  });
});
