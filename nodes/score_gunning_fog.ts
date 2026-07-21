import { ReadabilityText, ReadabilityScore } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { rs, validateText } from './readability_helper';

/**
 * Gunning Fog index. See axiom.yaml for the formula.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export async function scoreGunningFog(ax: AxiomContext, input: ReadabilityText): Promise<ReadabilityScore> {
  const out = new ReadabilityScore();
  out.setFormula('gunning_fog');

  const err = validateText(input.getText());
  if (err) {
    out.setError(err);
    return out;
  }

  out.setScore(rs.gunningFog(input.getText()));
  return out;
}
