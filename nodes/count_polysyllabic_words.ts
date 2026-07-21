import { ReadabilityText, WordSyllableBucketCounts } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { validateText, countSyllableBucket } from './readability_helper';

/**
 * Count of words with 3 or more syllables -- the SMOG index's core input.
 * See axiom.yaml.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export async function countPolysyllabicWords(ax: AxiomContext, input: ReadabilityText): Promise<WordSyllableBucketCounts> {
  const out = new WordSyllableBucketCounts();
  out.setBucket('POLYSYLLABIC');

  const err = validateText(input.getText());
  if (err) {
    out.setError(err);
    return out;
  }

  const { count, totalWords } = countSyllableBucket(input.getText(), (s) => s >= 3);
  out.setCount(count);
  out.setTotalWords(totalWords);
  return out;
}
