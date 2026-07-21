import { ReadabilityText, ReadabilityScore } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { rs, validateText } from './readability_helper';

/**
 * Coleman-Liau index. See axiom.yaml for the formula.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export async function scoreColemanLiauIndex(ax: AxiomContext, input: ReadabilityText): Promise<ReadabilityScore> {
  const out = new ReadabilityScore();
  out.setFormula('coleman_liau_index');

  const err = validateText(input.getText());
  if (err) {
    out.setError(err);
    return out;
  }

  out.setScore(rs.colemanLiauIndex(input.getText()));
  return out;
}
