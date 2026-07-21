import { ReadabilityText } from '../gen/messages_pb';
import { countCharacters } from './count_characters';
import { ctx } from './testkit';
import { MAX_TEXT_CHARS } from './readability_helper';

function req(text: string): ReadabilityText {
  const input = new ReadabilityText();
  input.setText(text);
  return input;
}

const ORACLE_TEXT =
  'The cat sat on the mat. The dog ran in the yard. Birds sing sweet songs each morning.';

describe('CountCharacters', () => {
  // INDEPENDENT ORACLE -- counted by hand: the passage has 18 words whose
  // own lengths (including trailing periods where present) are
  // 3,3,3,2,3,4,3,3,3,2,3,5,5,4,5,5,4,8 = sum 68 non-space characters, of
  // which 65 are letters (the 3 periods are non-letters).
  it('ORACLE: counts hand-tallied non-space characters and letters', async () => {
    const out = await countCharacters(ctx, req(ORACLE_TEXT));
    expect(out.getError()).toBe('');
    expect(out.getCharacterCount()).toBe(68);
    expect(out.getLetterCount()).toBe(65);
  });

  it('a short literal string counts exactly', async () => {
    // "Hi, Bob! 2024" -> non-space chars: "Hi,Bob!2024" = 11; the wrapped
    // library's "letters" pass strips punctuation (, !) but NOT digits, so
    // "HiBob2024" = 9.
    const out = await countCharacters(ctx, req('Hi, Bob! 2024'));
    expect(out.getCharacterCount()).toBe(11);
    expect(out.getLetterCount()).toBe(9);
  });

  it('DETERMINISM: repeated calls agree', async () => {
    const a = await countCharacters(ctx, req(ORACLE_TEXT));
    const b = await countCharacters(ctx, req(ORACLE_TEXT));
    expect(a.getCharacterCount()).toBe(b.getCharacterCount());
  });

  // ── Error path ─────────────────────────────────────────────────────────

  it('ERROR PATH: empty text returns EMPTY_TEXT', async () => {
    const out = await countCharacters(ctx, req(''));
    expect(out.getError()).toBe('EMPTY_TEXT');
    expect(out.hasCharacterCount()).toBe(false);
  });

  it('ERROR PATH: whitespace-only text returns EMPTY_TEXT', async () => {
    const out = await countCharacters(ctx, req('   '));
    expect(out.getError()).toBe('EMPTY_TEXT');
  });

  it('ERROR PATH: oversized text returns TEXT_TOO_LONG', async () => {
    const out = await countCharacters(ctx, req('a'.repeat(MAX_TEXT_CHARS + 1)));
    expect(out.getError()).toBe('TEXT_TOO_LONG');
  });
});
