import { ReadabilityText } from '../gen/messages_pb';
import { findDifficultWords } from './find_difficult_words';
import { ctx } from './testkit';

function req(text: string, threshold?: number): ReadabilityText {
  const input = new ReadabilityText();
  input.setText(text);
  if (threshold !== undefined) input.setDifficultWordSyllableThreshold(threshold);
  return input;
}

const ORACLE_TEXT =
  'The cat sat on the mat. The dog ran in the yard. Birds sing sweet songs each morning.';

describe('FindDifficultWords', () => {
  // INDEPENDENT ORACLE -- with the default threshold of 2 syllables, a
  // word can only be "difficult" if it has 2+ syllables. Of the 18 words,
  // only "morning" (2 syllables) clears that bar at all -- every other
  // word is monosyllabic and is therefore excluded by the syllable gate
  // ALONE, independent of whatever the bundled word list contains. So the
  // result must be exactly {count: 1, words: ["morning"]} regardless of
  // dictionary contents.
  it('ORACLE: exactly one word clears the syllable-count gate', async () => {
    const out = await findDifficultWords(ctx, req(ORACLE_TEXT));
    expect(out.getError()).toBe('');
    expect(out.getCount()).toBe(1);
    expect(out.getWordsList()).toEqual(['morning']);
    expect(out.getSyllableThreshold()).toBe(2);
  });

  // A raised threshold that even "morning" (2 syllables) cannot clear
  // must produce zero difficult words -- again forced purely by the
  // syllable gate, independent of the dictionary.
  it('ORACLE: raising the threshold above every word\'s syllable count yields zero', async () => {
    const out = await findDifficultWords(ctx, req(ORACLE_TEXT, 3));
    expect(out.getCount()).toBe(0);
    expect(out.getWordsList()).toEqual([]);
    expect(out.getSyllableThreshold()).toBe(3);
  });

  it('an obscure multi-syllable technical word is flagged difficult', async () => {
    const out = await findDifficultWords(ctx, req('The mitochondria produce energy.'));
    expect(out.getWordsList()).toContain('mitochondria');
  });

  // ── Error path ─────────────────────────────────────────────────────────

  it('ERROR PATH: empty text returns EMPTY_TEXT', async () => {
    const out = await findDifficultWords(ctx, req(''));
    expect(out.getError()).toBe('EMPTY_TEXT');
  });

  it('handles a large input without crashing (no payload-length cap)', async () => {
    const out = await findDifficultWords(ctx, req('a '.repeat(60_000)));
    expect(out.getError()).toBe('');
  });

  it('ERROR PATH: a syllable threshold of 0 returns INVALID_SYLLABLE_THRESHOLD', async () => {
    const out = await findDifficultWords(ctx, req(ORACLE_TEXT, 0));
    expect(out.getError()).toBe('INVALID_SYLLABLE_THRESHOLD');
  });

  it('ERROR PATH: a syllable threshold of 11 returns INVALID_SYLLABLE_THRESHOLD', async () => {
    const out = await findDifficultWords(ctx, req(ORACLE_TEXT, 11));
    expect(out.getError()).toBe('INVALID_SYLLABLE_THRESHOLD');
  });
});
