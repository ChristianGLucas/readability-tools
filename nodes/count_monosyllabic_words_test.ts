import { ReadabilityText } from '../gen/messages_pb';
import { countMonosyllabicWords } from './count_monosyllabic_words';
import { ctx } from './testkit';

function req(text: string): ReadabilityText {
  const input = new ReadabilityText();
  input.setText(text);
  return input;
}

const ORACLE_TEXT =
  'The cat sat on the mat. The dog ran in the yard. Birds sing sweet songs each morning.';

describe('CountMonosyllabicWords', () => {
  it('sets bucket to MONOSYLLABIC', async () => {
    const out = await countMonosyllabicWords(ctx, req(ORACLE_TEXT));
    expect(out.getBucket()).toBe('MONOSYLLABIC');
  });

  // INDEPENDENT ORACLE -- 17 of the 18 words are unambiguous single-
  // syllable English words; only "morning" (2 syllables) is not.
  it('ORACLE: 17 of 18 words are monosyllabic in the fixed passage', async () => {
    const out = await countMonosyllabicWords(ctx, req(ORACLE_TEXT));
    expect(out.getError()).toBe('');
    expect(out.getCount()).toBe(17);
    expect(out.getTotalWords()).toBe(18);
  });

  // ── Error path ─────────────────────────────────────────────────────────

  it('ERROR PATH: empty text returns EMPTY_TEXT', async () => {
    const out = await countMonosyllabicWords(ctx, req(''));
    expect(out.getError()).toBe('EMPTY_TEXT');
    expect(out.hasCount()).toBe(false);
  });

  it('handles a large input without crashing (no payload-length cap)', async () => {
    const out = await countMonosyllabicWords(ctx, req('a '.repeat(60_000)));
    expect(out.getError()).toBe('');
  });
});
