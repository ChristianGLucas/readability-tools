import { ReadabilityText, ReadabilityReport } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  rs,
  validateText,
  validateWordsPerMinute,
  validateSyllableThreshold,
  countSyllableBucket,
  DEFAULT_WORDS_PER_MINUTE,
  DEFAULT_SYLLABLE_THRESHOLD,
} from './readability_helper';

/**
 * Every count and formula in this package for one passage, in a single
 * call. Each field is computed identically to its dedicated node. See
 * axiom.yaml.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export async function analyzeReadability(ax: AxiomContext, input: ReadabilityText): Promise<ReadabilityReport> {
  const out = new ReadabilityReport();

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

  const threshold = input.hasDifficultWordSyllableThreshold()
    ? input.getDifficultWordSyllableThreshold()
    : undefined;
  const thresholdErr = validateSyllableThreshold(threshold);
  if (thresholdErr) {
    out.setError(thresholdErr);
    return out;
  }

  const text = input.getText();
  const effectiveWpm = wpm ?? DEFAULT_WORDS_PER_MINUTE;
  const effectiveThreshold = threshold ?? DEFAULT_SYLLABLE_THRESHOLD;

  out.setCharacterCount(rs.charCount(text, true));
  const wordCount = rs.lexiconCount(text, true);
  out.setWordCount(wordCount);
  out.setSentenceCount(rs.sentenceCount(text));
  out.setSyllableCount(rs.syllableCount(text));
  out.setPolysyllableCount(countSyllableBucket(text, (s) => s >= 3).count);
  out.setMonosyllableCount(countSyllableBucket(text, (s) => s === 1).count);
  out.setDifficultWordCount(rs.difficultWordsSet(text, effectiveThreshold).size);

  out.setFleschReadingEase(rs.fleschReadingEase(text));
  out.setFleschKincaidGrade(rs.fleschKincaidGrade(text));
  out.setGunningFog(rs.gunningFog(text));
  out.setSmogIndex(rs.smogIndex(text));
  out.setColemanLiauIndex(rs.colemanLiauIndex(text));
  out.setAutomatedReadabilityIndex(rs.automatedReadabilityIndex(text));
  out.setDaleChallScore(rs.daleChallReadabilityScore(text));
  out.setLinsearWrite(rs.linsearWriteFormula(text));
  out.setLix(rs.lix(text));
  out.setRix(rs.rix(text));

  out.setConsensusGradeLabel(String(rs.textStandard(text, false)));
  out.setConsensusGradeFloat(Number(rs.textStandard(text, true)));

  out.setEstimatedReadingMinutes(wordCount / effectiveWpm);

  return out;
}
