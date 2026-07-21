import { ReadabilityText } from '../gen/messages_pb';
import { analyzeReadability } from './analyze_readability';
import { ctx } from './testkit';
import { MAX_TEXT_CHARS } from './readability_helper';

function req(text: string, wpm?: number, threshold?: number): ReadabilityText {
  const input = new ReadabilityText();
  input.setText(text);
  if (wpm !== undefined) input.setWordsPerMinute(wpm);
  if (threshold !== undefined) input.setDifficultWordSyllableThreshold(threshold);
  return input;
}

const ORACLE_TEXT =
  'The cat sat on the mat. The dog ran in the yard. Birds sing sweet songs each morning.';

describe('AnalyzeReadability', () => {
  // INDEPENDENT ORACLE -- every field below is individually hand-derived
  // in the dedicated node tests (CountCharacters, CountWords, ...,
  // ScoreConsensusGradeLevel, EstimateReadingTime). This test re-asserts
  // the SAME hand-computed values here to prove the aggregate node
  // computes each one identically rather than diverging from its
  // dedicated counterpart -- the aggregate's whole reason to exist is
  // that identity holding.
  it('ORACLE: every field matches its dedicated node\'s independently hand-derived value', async () => {
    const out = await analyzeReadability(ctx, req(ORACLE_TEXT));
    expect(out.getError()).toBe('');

    expect(out.getCharacterCount()).toBe(68);
    expect(out.getWordCount()).toBe(18);
    expect(out.getSentenceCount()).toBe(3);
    expect(out.getSyllableCount()).toBe(19);
    expect(out.getPolysyllableCount()).toBe(0);
    expect(out.getMonosyllableCount()).toBe(17);
    expect(out.getDifficultWordCount()).toBe(1);

    expect(out.getFleschReadingEase()).toBeCloseTo(107.69, 2);
    expect(out.getFleschKincaidGrade()).toBeCloseTo(-0.4, 1);
    expect(out.getGunningFog()).toBeCloseTo(2.4, 2);
    expect(out.getSmogIndex()).toBeCloseTo(3.1, 1);
    expect(out.getColemanLiauIndex()).toBeCloseTo(0.11, 2);
    expect(out.getAutomatedReadabilityIndex()).toBeCloseTo(-0.7, 1);
    expect(out.getDaleChallScore()).toBeCloseTo(4.81, 2);
    expect(out.getLinsearWrite()).toBeCloseTo(2, 1);
    expect(out.getLix()).toBeCloseTo(11.56, 2);
    expect(out.getRix()).toBeCloseTo(0.33, 2);

    expect(out.getConsensusGradeLabel()).toBe('1st and 2nd grade');
    expect(out.getConsensusGradeFloat()).toBeCloseTo(2, 5);

    expect(out.getEstimatedReadingMinutes()).toBeCloseTo(0.09, 5);
  });

  it('a custom words_per_minute and syllable threshold both take effect', async () => {
    const out = await analyzeReadability(ctx, req(ORACLE_TEXT, 60, 3));
    expect(out.getEstimatedReadingMinutes()).toBeCloseTo(0.3, 5);
    // Raising the difficult-word threshold to 3 excludes "morning" (2
    // syllables), so the count drops from 1 to 0.
    expect(out.getDifficultWordCount()).toBe(0);
  });

  it('DETERMINISM: repeated calls agree', async () => {
    const a = await analyzeReadability(ctx, req(ORACLE_TEXT));
    const b = await analyzeReadability(ctx, req(ORACLE_TEXT));
    expect(a.getFleschReadingEase()).toBe(b.getFleschReadingEase());
    expect(a.getWordCount()).toBe(b.getWordCount());
  });

  // ── Error path ─────────────────────────────────────────────────────────

  it('ERROR PATH: empty text returns EMPTY_TEXT', async () => {
    const out = await analyzeReadability(ctx, req(''));
    expect(out.getError()).toBe('EMPTY_TEXT');
    expect(out.hasWordCount()).toBe(false);
  });

  it('ERROR PATH: oversized text returns TEXT_TOO_LONG', async () => {
    const out = await analyzeReadability(ctx, req('a'.repeat(MAX_TEXT_CHARS + 1)));
    expect(out.getError()).toBe('TEXT_TOO_LONG');
  });

  it('ERROR PATH: an invalid words_per_minute returns INVALID_WORDS_PER_MINUTE', async () => {
    const out = await analyzeReadability(ctx, req(ORACLE_TEXT, 1));
    expect(out.getError()).toBe('INVALID_WORDS_PER_MINUTE');
  });

  it('ERROR PATH: an invalid syllable threshold returns INVALID_SYLLABLE_THRESHOLD', async () => {
    const out = await analyzeReadability(ctx, req(ORACLE_TEXT, undefined, 99));
    expect(out.getError()).toBe('INVALID_SYLLABLE_THRESHOLD');
  });
});
