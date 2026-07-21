import { ReadabilityText, ReadabilityScore } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { rs, validateText } from './readability_helper';

/**
 * New Dale-Chall readability score. See axiom.yaml for the formula and score bands.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export async function scoreDaleChallReadability(ax: AxiomContext, input: ReadabilityText): Promise<ReadabilityScore> {
  const out = new ReadabilityScore();
  out.setFormula('dale_chall_readability_score');

  const err = validateText(input.getText());
  if (err) {
    out.setError(err);
    return out;
  }

  out.setScore(rs.daleChallReadabilityScore(input.getText()));
  return out;
}
