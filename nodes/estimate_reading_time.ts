import { ReadabilityText, ReadingTimeEstimate } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  rs,
  validateText,
  validateWordsPerMinute,
  DEFAULT_WORDS_PER_MINUTE,
} from './readability_helper';

/**
 * Estimated silent-reading time from word count / words_per_minute.
 * See axiom.yaml.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export async function estimateReadingTime(ax: AxiomContext, input: ReadabilityText): Promise<ReadingTimeEstimate> {
  const out = new ReadingTimeEstimate();

  const textErr = validateText(input.getText());
  if (textErr) {
    out.setError(textErr);
    return out;
  }

  const wpm = input.hasWordsPerMinute() ? input.getWordsPerMinute() : undefined;
  const wpmErr = validateWordsPerMinute(wpm);
  if (wpmErr) {
    out.setError(wpmErr);
    return out;
  }

  const effectiveWpm = wpm ?? DEFAULT_WORDS_PER_MINUTE;
  const words = rs.lexiconCount(input.getText(), true);
  const minutes = words / effectiveWpm;

  out.setMinutes(minutes);
  out.setSeconds(Math.ceil(minutes * 60));
  out.setWordsPerMinute(effectiveWpm);
  return out;
}
