import { ReadabilityText, SyllableCounts } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { rs, validateText } from './readability_helper';

/**
 * Total syllable count for the passage plus average syllables per word.
 * See axiom.yaml.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export async function countSyllables(ax: AxiomContext, input: ReadabilityText): Promise<SyllableCounts> {
  const out = new SyllableCounts();

  const err = validateText(input.getText());
  if (err) {
    out.setError(err);
    return out;
  }

  const syllables = rs.syllableCount(input.getText());
  out.setSyllableCount(syllables);
  out.setAverageSyllablesPerWord(rs.averageSyllablePerWord(input.getText()));
  return out;
}
