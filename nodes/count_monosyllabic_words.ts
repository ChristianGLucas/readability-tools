import { ReadabilityText, WordSyllableBucketCounts } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { validateText, countSyllableBucket } from './readability_helper';

/**
 * Count of words with exactly 1 syllable. See axiom.yaml.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export async function countMonosyllabicWords(ax: AxiomContext, input: ReadabilityText): Promise<WordSyllableBucketCounts> {
  const out = new WordSyllableBucketCounts();
  out.setBucket('MONOSYLLABIC');

  const err = validateText(input.getText());
  if (err) {
    out.setError(err);
    return out;
  }

  const { count, totalWords } = countSyllableBucket(input.getText(), (s) => s === 1);
  out.setCount(count);
  out.setTotalWords(totalWords);
  return out;
}
