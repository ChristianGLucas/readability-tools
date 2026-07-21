import { ReadabilityText, SentenceCounts } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { rs, validateText } from './readability_helper';

/**
 * Sentence count for the passage, using a terminal .?!  + capital-letter-
 * follows heuristic. See axiom.yaml.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export async function countSentences(ax: AxiomContext, input: ReadabilityText): Promise<SentenceCounts> {
  const out = new SentenceCounts();

  const err = validateText(input.getText());
  if (err) {
    out.setError(err);
    return out;
  }

  out.setSentenceCount(rs.sentenceCount(input.getText()));
  return out;
}
