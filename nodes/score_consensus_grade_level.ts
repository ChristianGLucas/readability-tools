import { ReadabilityText, ConsensusGradeLevel } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { rs, validateText } from './readability_helper';

/**
 * A single consensus estimated US school-grade level across eight
 * formulas (the statistical mode, robust to any single formula's
 * outlier). See axiom.yaml.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export async function scoreConsensusGradeLevel(ax: AxiomContext, input: ReadabilityText): Promise<ConsensusGradeLevel> {
  const out = new ConsensusGradeLevel();

  const err = validateText(input.getText());
  if (err) {
    out.setError(err);
    return out;
  }

  const text = input.getText();
  out.setGradeLabel(String(rs.textStandard(text, false)));
  out.setGradeFloat(Number(rs.textStandard(text, true)));
  return out;
}
