import { ReadabilityText, ReadabilityScore } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { rs, validateText } from './readability_helper';

/**
 * SMOG index. See axiom.yaml for the formula and the <3-sentence special case.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export async function scoreSmogIndex(ax: AxiomContext, input: ReadabilityText): Promise<ReadabilityScore> {
  const out = new ReadabilityScore();
  out.setFormula('smog_index');

  const err = validateText(input.getText());
  if (err) {
    out.setError(err);
    return out;
  }

  out.setScore(rs.smogIndex(input.getText()));
  return out;
}
