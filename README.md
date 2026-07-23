# christiangeorgelucas/readability-tools

Composable [Axiom](https://axiomide.com) nodes for **text readability &
statistics** — quantitative complexity/reading-level scoring, distinct from
our NLP (tokenize/POS/NER), spell-correction, phonetic, and
language-detection packages, none of which score how readable a passage is.
Built for the Axiom marketplace.

Wraps [`text-readability`](https://www.npmjs.com/package/text-readability)
(MIT), a faithful JavaScript/TypeScript port of Python's
[`textstat`](https://github.com/textstat/textstat), itself built only on the
MIT [`syllable`](https://www.npmjs.com/package/syllable) and
[`pluralize`](https://www.npmjs.com/package/pluralize) packages — no
dictionary download, no native bindings, no network calls of any kind.

**Why not Python's `textstat` directly?** It was evaluated first and
rejected at the license gate: its syllable counting hard-depends on
[`pyphen`](https://pypi.org/project/Pyphen/), which is
GPL-2.0+/LGPL-2.1+/MPL-1.1 tri-licensed (copyleft — disqualifying), and falls
back to NLTK's `cmudict` corpus, which `nltk.download()`s over the network on
first use if not already cached. This TypeScript dependency chain has
neither problem.

## Use it from your agent or app

Every node in this package is a **live, auto-scaling API endpoint** on the
[Axiom](https://axiomide.com) marketplace — call it from an AI agent or your own
code, with nothing to self-host.

**📦 See it on the marketplace:**
https://dev.axiomide.com/marketplace/christiangeorgelucas/readability-tools@0.1.0

**Hook it up to an AI agent (MCP).** Add Axiom's hosted MCP server to any MCP
client and every node becomes a typed tool your agent can call — search the
catalog, inspect a schema, and invoke it directly.

```bash
# Claude Code
claude mcp add --transport http axiom https://api.axiomide.com/mcp \
  --header "Authorization: Bearer $AXIOM_API_KEY"
```

Claude Desktop, Cursor, or any config-based client:

```json
{
  "mcpServers": {
    "axiom": {
      "type": "http",
      "url": "https://api.axiomide.com/mcp",
      "headers": { "Authorization": "Bearer YOUR_AXIOM_API_KEY" }
    }
  }
}
```

**Call it from the CLI.**

```bash
axiom invoke christiangeorgelucas/readability-tools/ScoreFleschReadingEase --input '{ ... }'
```

**Call it over HTTP.**

```bash
curl -X POST https://api.axiomide.com/invocations/v1/nodes/christiangeorgelucas/readability-tools/0.1.0/ScoreFleschReadingEase \
  -H "Authorization: Bearer $AXIOM_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```

> Input/output schema for each node is on the marketplace page above, or via
> `axiom inspect node christiangeorgelucas/readability-tools/ScoreFleschReadingEase`.

### Get started free

Install the CLI:

```bash
# macOS / Linux — Homebrew
brew install axiomide/tap/axiom

# macOS / Linux — install script
curl -fsSL https://raw.githubusercontent.com/AxiomIDE/axiom-releases/main/install.sh | sh
```

**Windows:** download the `windows/amd64` `.zip` from the
[releases page](https://github.com/AxiomIDE/axiom-releases/releases), unzip it,
and put `axiom.exe` on your `PATH`.

Then `axiom version` to verify, `axiom login` (GitHub or Google) to authenticate,
and create an API key under **Console → API Keys**. Docs and sign-up at
**[axiomide.com](https://axiomide.com)**.

## Nodes

Twenty nodes over a single shared `ReadabilityText { text }` input envelope:

**Ten readability formulas** (each an `optional double score` +
`formula` name + structured `error`):

- **ScoreFleschReadingEase** / **ScoreFleschKincaidGrade** — the classic
  Flesch formulas.
- **ScoreGunningFog** — the Fog index.
- **ScoreSmogIndex** — SMOG (needs >=3 sentences to be meaningful; returns
  0 below that, per the published formula's own norming).
- **ScoreColemanLiauIndex** — letter-count-driven, robust to invented words.
- **ScoreAutomatedReadabilityIndex** — ARI.
- **ScoreDaleChallReadability** — New Dale-Chall, using a bundled ~3000-word
  familiar-word list.
- **ScoreLinsearWrite** — Linsear Write over the first 100 words.
- **ScoreLix** / **ScoreRix** — the Swedish LIX/RIX formulas (language-
  agnostic word/sentence-length metrics).

**Counting primitives:**

- **CountCharacters** — non-space character and letter counts.
- **CountWords**, **CountSentences**, **CountSyllables**.
- **CountPolysyllabicWords** / **CountMonosyllabicWords** — words with 3+ /
  exactly 1 syllables.
- **FindDifficultWords** — words absent from the familiar-word list, with a
  configurable syllable threshold; returns both the count and the word list.
- **EstimateReadingTime** — word count / assumed reading speed (default 200
  wpm, configurable).

**Consensus + bundle:**

- **ScoreConsensusGradeLevel** — the statistical mode across 8 of the
  formulas above (robust to any single formula's outlier), e.g.
  `"8th and 9th grade"`.
- **AnalyzeReadability** — every count and formula for one passage in a
  single call.

Every node is stateless, deterministic, and returns a structured `error`
token (`EMPTY_TEXT`, `TEXT_TOO_LONG`, `INVALID_WORDS_PER_MINUTE`,
`INVALID_SYLLABLE_THRESHOLD`) instead of crashing on malformed input. `text`
is capped at 50,000 UTF-16 characters. Score/count fields are proto3
`optional` so a legitimately-zero result (e.g. zero polysyllabic words) is
never dropped from a JSON response.

## Composability

The shared `text` field name matches the field already used by this
publisher's `nlp-tools` (`Document`), `ocr-tools` (`OcrResult`/`TextOut`),
`pdf-tools` (`TextResult`), `html-tools` (`TextResult`), and
`language-detect-tools` (`DetectInput`) — any of those packages' extracted
text flows straight into every node here with a trivial one-field mapping.

## License

MIT. See `LICENSE`.
