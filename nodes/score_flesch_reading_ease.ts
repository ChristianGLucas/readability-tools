import { ReadabilityText, ReadabilityScore } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { rs, validateText } from './readability_helper';

/**
 * Flesch Reading Ease score. See axiom.yaml for the formula and published bands.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export async function scoreFleschReadingEase(ax: AxiomContext, input: ReadabilityText): Promise<ReadabilityScore> {
  const out = new ReadabilityScore();
  out.setFormula('flesch_reading_ease');

  const err = validateText(input.getText());
  if (err) {
    out.setError(err);
    return out;
  }

  out.setScore(rs.fleschReadingEase(input.getText()));
  return out;
}
