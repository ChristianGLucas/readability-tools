// Shared helper for every node in this package: input validation/bounds,
// and thin wrappers around the `text-readability` npm package (MIT --
// itself built only on the MIT `syllable` and `pluralize` packages, no
// dictionary download, no native bindings, no network calls of any kind).
//
// text-readability is a faithful JS/TS port of Python's textstat. Every
// readability FORMULA below is delegated straight to it -- this module
// only adds: (1) bounds/validation the library doesn't do itself, and
// (2) two thin compositions (monosyllable-word counting, and reading time)
// built from primitives the library already exposes per-word, the exact
// same technique text-readability's own polySyllableCount() uses
// internally (see node_modules/text-readability/main.js) -- not a
// reimplementation of anything the library owns.

import rs from 'text-readability';

export const DEFAULT_WORDS_PER_MINUTE = 200;
export const MIN_WORDS_PER_MINUTE = 50;
export const MAX_WORDS_PER_MINUTE = 1000;

export const DEFAULT_SYLLABLE_THRESHOLD = 2;
export const MIN_SYLLABLE_THRESHOLD = 1;
export const MAX_SYLLABLE_THRESHOLD = 10;

export type ValidationErrorToken =
  | 'EMPTY_TEXT'
  | 'INVALID_WORDS_PER_MINUTE'
  | 'INVALID_SYLLABLE_THRESHOLD';

// Rejects blank/whitespace-only text, which every formula below would
// otherwise silently score as some degenerate zero/NaN-derived value
// instead of a clear error. No length limit -- payload size is the
// platform's job, not this node's.
export function validateText(text: string): ValidationErrorToken | null {
  if (!text || text.trim().length === 0) return 'EMPTY_TEXT';
  return null;
}

export function validateWordsPerMinute(wpm: number | undefined): ValidationErrorToken | null {
  if (wpm === undefined) return null;
  if (!Number.isFinite(wpm) || wpm < MIN_WORDS_PER_MINUTE || wpm > MAX_WORDS_PER_MINUTE) {
    return 'INVALID_WORDS_PER_MINUTE';
  }
  return null;
}

export function validateSyllableThreshold(threshold: number | undefined): ValidationErrorToken | null {
  if (threshold === undefined) return null;
  if (
    !Number.isInteger(threshold) ||
    threshold < MIN_SYLLABLE_THRESHOLD ||
    threshold > MAX_SYLLABLE_THRESHOLD
  ) {
    return 'INVALID_SYLLABLE_THRESHOLD';
  }
  return null;
}

// Word splitting that matches text-readability's own internal
// Readability.split() (used by polySyllableCount/linsearWriteFormula) --
// comma/space/newline/CR delimited, empty tokens dropped. Reused here so
// CountMonosyllabicWords buckets words the same way the library's own
// CountPolysyllabicWords (polySyllableCount) does, for a consistent
// total_words denominator between the two.
function splitWords(text: string): string[] {
  return text.split(/,| |\n|\r/g).filter((w) => w.length > 0);
}

export function countSyllableBucket(text: string, predicate: (syllables: number) => boolean): {
  count: number;
  totalWords: number;
} {
  const words = splitWords(text);
  let count = 0;
  for (const word of words) {
    if (predicate(rs.syllableCount(word))) count += 1;
  }
  return { count, totalWords: words.length };
}

export { rs };
