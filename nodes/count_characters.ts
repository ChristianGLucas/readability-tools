import { ReadabilityText, CharacterCounts } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { rs, validateText } from './readability_helper';

/**
 * Character-level counts for the passage: total non-space characters and
 * letters-only (punctuation/digits also excluded). See axiom.yaml.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export async function countCharacters(ax: AxiomContext, input: ReadabilityText): Promise<CharacterCounts> {
  const out = new CharacterCounts();

  const err = validateText(input.getText());
  if (err) {
    out.setError(err);
    return out;
  }

  out.setCharacterCount(rs.charCount(input.getText(), true));
  out.setLetterCount(rs.letterCount(input.getText(), true));
  return out;
}
