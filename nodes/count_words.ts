import { ReadabilityText, WordCounts } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { rs, validateText } from './readability_helper';

/**
 * Word (lexicon) count for the passage: whitespace-delimited tokens with
 * punctuation stripped. See axiom.yaml.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export async function countWords(ax: AxiomContext, input: ReadabilityText): Promise<WordCounts> {
  const out = new WordCounts();

  const err = validateText(input.getText());
  if (err) {
    out.setError(err);
    return out;
  }

  out.setWordCount(rs.lexiconCount(input.getText(), true));
  return out;
}
