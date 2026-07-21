import { ReadabilityText, DifficultWordCounts } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  rs,
  validateText,
  validateSyllableThreshold,
  DEFAULT_SYLLABLE_THRESHOLD,
} from './readability_helper';

/**
 * Words classified as "difficult" (at least difficult_word_syllable_
 * threshold syllables AND absent from the bundled Dale-Chall familiar-word
 * list) -- both the count and the deduplicated word list. See axiom.yaml.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export async function findDifficultWords(ax: AxiomContext, input: ReadabilityText): Promise<DifficultWordCounts> {
  const out = new DifficultWordCounts();

  const textErr = validateText(input.getText());
  if (textErr) {
    out.setError(textErr);
    return out;
  }

  const threshold = input.hasDifficultWordSyllableThreshold()
    ? input.getDifficultWordSyllableThreshold()
    : undefined;
  const thresholdErr = validateSyllableThreshold(threshold);
  if (thresholdErr) {
    out.setError(thresholdErr);
    return out;
  }

  const effectiveThreshold = threshold ?? DEFAULT_SYLLABLE_THRESHOLD;
  const words = [...rs.difficultWordsSet(input.getText(), effectiveThreshold)] as string[];
  out.setCount(words.length);
  out.setWordsList(words);
  out.setSyllableThreshold(effectiveThreshold);
  return out;
}
