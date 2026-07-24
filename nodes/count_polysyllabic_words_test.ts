import { ReadabilityText } from '../gen/messages_pb';
import { countPolysyllabicWords } from './count_polysyllabic_words';
import { ctx } from './testkit';

function req(text: string): ReadabilityText {
  const input = new ReadabilityText();
  input.setText(text);
  return input;
}

const ORACLE_TEXT =
  'The cat sat on the mat. The dog ran in the yard. Birds sing sweet songs each morning.';

describe('CountPolysyllabicWords', () => {
  it('sets bucket to POLYSYLLABIC', async () => {
    const out = await countPolysyllabicWords(ctx, req(ORACLE_TEXT));
    expect(out.getBucket()).toBe('POLYSYLLABIC');
  });

  // INDEPENDENT ORACLE -- no word in the passage has 3+ syllables (the
  // longest, "morning", is 2 syllables), so the count is 0. Marked
  // `optional` in the proto specifically so this legitimate zero is not
  // dropped from a JSON response.
  it('ORACLE: zero words have 3+ syllables in the fixed passage', async () => {
    const out = await countPolysyllabicWords(ctx, req(ORACLE_TEXT));
    expect(out.getError()).toBe('');
    expect(out.hasCount()).toBe(true);
    expect(out.getCount()).toBe(0);
    expect(out.getTotalWords()).toBe(18);
  });

  // INDEPENDENT ORACLE -- "organization" (or-ga-ni-za-tion, 5 syllables)
  // and "celebrated" (cel-e-bra-ted, 4 syllables) both unambiguously have
  // 3+ syllables by standard dictionary pronunciation; "The" does not.
  it('ORACLE: counts 2 of 3 words as polysyllabic in a second fixed passage', async () => {
    const out = await countPolysyllabicWords(ctx, req('The organization celebrated.'));
    expect(out.getCount()).toBe(2);
    expect(out.getTotalWords()).toBe(3);
  });

  // ── Error path ─────────────────────────────────────────────────────────

  it('ERROR PATH: empty text returns EMPTY_TEXT', async () => {
    const out = await countPolysyllabicWords(ctx, req(''));
    expect(out.getError()).toBe('EMPTY_TEXT');
    expect(out.hasCount()).toBe(false);
  });

  it('handles a large input without crashing (no payload-length cap)', async () => {
    const out = await countPolysyllabicWords(ctx, req('a '.repeat(60_000)));
    expect(out.getError()).toBe('');
  });
});
