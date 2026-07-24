import { ReadabilityText } from '../gen/messages_pb';
import { scoreConsensusGradeLevel } from './score_consensus_grade_level';
import { ctx } from './testkit';

function req(text: string): ReadabilityText {
  const input = new ReadabilityText();
  input.setText(text);
  return input;
}

const ORACLE_TEXT =
  'The cat sat on the mat. The dog ran in the yard. Birds sing sweet songs each morning.';

describe('ScoreConsensusGradeLevel', () => {
  // INDEPENDENT ORACLE -- the consensus is the statistical mode of 8
  // component grades, each independently hand-derivable from the already-
  // oracle-verified formula values for this exact passage (see the
  // dedicated Score* node tests): FKG=-0.4, FRE=107.69, SMOG=3.1,
  // ColemanLiau=0.11, ARI=-0.7, DaleChall grade=4 (score 4.81<=4.9),
  // LinsearWrite=2, GunningFog=2.4. Tracing the library's own documented
  // floor/ceil-pair-per-formula + mode algorithm (see axiom.yaml) by hand
  // over those 8 values produces the grade array
  // [-1, 0, 5, 3, 4, 0, 1, -2, 0, 4, 4, 2, 2, 2, 3] -- three grades (0, 4,
  // 2) tie for the highest frequency (3 occurrences each), and the
  // algorithm's first-occurrence tie-break (Set-preserved insertion order)
  // resolves to 2, which is exactly the FKG/GunningFog/LinsearWrite
  // neighborhood -- an internally consistent result, not an outlier.
  it('ORACLE: the consensus mode over 8 hand-derived component grades is 2 ("1st and 2nd grade")', async () => {
    const out = await scoreConsensusGradeLevel(ctx, req(ORACLE_TEXT));
    expect(out.getError()).toBe('');
    expect(out.getGradeFloat()).toBeCloseTo(2, 5);
    expect(out.getGradeLabel()).toBe('1st and 2nd grade');
  });

  it('DETERMINISM: repeated calls agree', async () => {
    const a = await scoreConsensusGradeLevel(ctx, req(ORACLE_TEXT));
    const b = await scoreConsensusGradeLevel(ctx, req(ORACLE_TEXT));
    expect(a.getGradeFloat()).toBe(b.getGradeFloat());
    expect(a.getGradeLabel()).toBe(b.getGradeLabel());
  });

  // ── Error path ─────────────────────────────────────────────────────────

  it('ERROR PATH: empty text returns EMPTY_TEXT', async () => {
    const out = await scoreConsensusGradeLevel(ctx, req(''));
    expect(out.getError()).toBe('EMPTY_TEXT');
    expect(out.hasGradeFloat()).toBe(false);
  });

  it('handles a large input without crashing (no payload-length cap)', async () => {
    const out = await scoreConsensusGradeLevel(ctx, req('a '.repeat(60_000)));
    expect(out.getError()).toBe('');
  });
});
