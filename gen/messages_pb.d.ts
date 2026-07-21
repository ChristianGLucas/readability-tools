// package: christiangeorgelucas.readability_tools
// file: messages.proto

import * as jspb from "google-protobuf";

export class ReadabilityText extends jspb.Message {
  getText(): string;
  setText(value: string): void;

  hasWordsPerMinute(): boolean;
  clearWordsPerMinute(): void;
  getWordsPerMinute(): number;
  setWordsPerMinute(value: number): void;

  hasDifficultWordSyllableThreshold(): boolean;
  clearDifficultWordSyllableThreshold(): void;
  getDifficultWordSyllableThreshold(): number;
  setDifficultWordSyllableThreshold(value: number): void;

  hasFloatOutput(): boolean;
  clearFloatOutput(): void;
  getFloatOutput(): boolean;
  setFloatOutput(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReadabilityText.AsObject;
  static toObject(includeInstance: boolean, msg: ReadabilityText): ReadabilityText.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ReadabilityText, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReadabilityText;
  static deserializeBinaryFromReader(message: ReadabilityText, reader: jspb.BinaryReader): ReadabilityText;
}

export namespace ReadabilityText {
  export type AsObject = {
    text: string,
    wordsPerMinute: number,
    difficultWordSyllableThreshold: number,
    floatOutput: boolean,
  }
}

export class ReadabilityScore extends jspb.Message {
  hasScore(): boolean;
  clearScore(): void;
  getScore(): number;
  setScore(value: number): void;

  getFormula(): string;
  setFormula(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReadabilityScore.AsObject;
  static toObject(includeInstance: boolean, msg: ReadabilityScore): ReadabilityScore.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ReadabilityScore, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReadabilityScore;
  static deserializeBinaryFromReader(message: ReadabilityScore, reader: jspb.BinaryReader): ReadabilityScore;
}

export namespace ReadabilityScore {
  export type AsObject = {
    score: number,
    formula: string,
    error: string,
  }
}

export class CharacterCounts extends jspb.Message {
  hasCharacterCount(): boolean;
  clearCharacterCount(): void;
  getCharacterCount(): number;
  setCharacterCount(value: number): void;

  hasLetterCount(): boolean;
  clearLetterCount(): void;
  getLetterCount(): number;
  setLetterCount(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CharacterCounts.AsObject;
  static toObject(includeInstance: boolean, msg: CharacterCounts): CharacterCounts.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CharacterCounts, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CharacterCounts;
  static deserializeBinaryFromReader(message: CharacterCounts, reader: jspb.BinaryReader): CharacterCounts;
}

export namespace CharacterCounts {
  export type AsObject = {
    characterCount: number,
    letterCount: number,
    error: string,
  }
}

export class WordCounts extends jspb.Message {
  hasWordCount(): boolean;
  clearWordCount(): void;
  getWordCount(): number;
  setWordCount(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WordCounts.AsObject;
  static toObject(includeInstance: boolean, msg: WordCounts): WordCounts.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WordCounts, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WordCounts;
  static deserializeBinaryFromReader(message: WordCounts, reader: jspb.BinaryReader): WordCounts;
}

export namespace WordCounts {
  export type AsObject = {
    wordCount: number,
    error: string,
  }
}

export class SentenceCounts extends jspb.Message {
  hasSentenceCount(): boolean;
  clearSentenceCount(): void;
  getSentenceCount(): number;
  setSentenceCount(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SentenceCounts.AsObject;
  static toObject(includeInstance: boolean, msg: SentenceCounts): SentenceCounts.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SentenceCounts, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SentenceCounts;
  static deserializeBinaryFromReader(message: SentenceCounts, reader: jspb.BinaryReader): SentenceCounts;
}

export namespace SentenceCounts {
  export type AsObject = {
    sentenceCount: number,
    error: string,
  }
}

export class SyllableCounts extends jspb.Message {
  hasSyllableCount(): boolean;
  clearSyllableCount(): void;
  getSyllableCount(): number;
  setSyllableCount(value: number): void;

  hasAverageSyllablesPerWord(): boolean;
  clearAverageSyllablesPerWord(): void;
  getAverageSyllablesPerWord(): number;
  setAverageSyllablesPerWord(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SyllableCounts.AsObject;
  static toObject(includeInstance: boolean, msg: SyllableCounts): SyllableCounts.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SyllableCounts, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SyllableCounts;
  static deserializeBinaryFromReader(message: SyllableCounts, reader: jspb.BinaryReader): SyllableCounts;
}

export namespace SyllableCounts {
  export type AsObject = {
    syllableCount: number,
    averageSyllablesPerWord: number,
    error: string,
  }
}

export class WordSyllableBucketCounts extends jspb.Message {
  hasCount(): boolean;
  clearCount(): void;
  getCount(): number;
  setCount(value: number): void;

  hasTotalWords(): boolean;
  clearTotalWords(): void;
  getTotalWords(): number;
  setTotalWords(value: number): void;

  getBucket(): string;
  setBucket(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WordSyllableBucketCounts.AsObject;
  static toObject(includeInstance: boolean, msg: WordSyllableBucketCounts): WordSyllableBucketCounts.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WordSyllableBucketCounts, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WordSyllableBucketCounts;
  static deserializeBinaryFromReader(message: WordSyllableBucketCounts, reader: jspb.BinaryReader): WordSyllableBucketCounts;
}

export namespace WordSyllableBucketCounts {
  export type AsObject = {
    count: number,
    totalWords: number,
    bucket: string,
    error: string,
  }
}

export class DifficultWordCounts extends jspb.Message {
  hasCount(): boolean;
  clearCount(): void;
  getCount(): number;
  setCount(value: number): void;

  clearWordsList(): void;
  getWordsList(): Array<string>;
  setWordsList(value: Array<string>): void;
  addWords(value: string, index?: number): string;

  hasSyllableThreshold(): boolean;
  clearSyllableThreshold(): void;
  getSyllableThreshold(): number;
  setSyllableThreshold(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DifficultWordCounts.AsObject;
  static toObject(includeInstance: boolean, msg: DifficultWordCounts): DifficultWordCounts.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DifficultWordCounts, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DifficultWordCounts;
  static deserializeBinaryFromReader(message: DifficultWordCounts, reader: jspb.BinaryReader): DifficultWordCounts;
}

export namespace DifficultWordCounts {
  export type AsObject = {
    count: number,
    wordsList: Array<string>,
    syllableThreshold: number,
    error: string,
  }
}

export class ReadingTimeEstimate extends jspb.Message {
  hasMinutes(): boolean;
  clearMinutes(): void;
  getMinutes(): number;
  setMinutes(value: number): void;

  hasSeconds(): boolean;
  clearSeconds(): void;
  getSeconds(): number;
  setSeconds(value: number): void;

  hasWordsPerMinute(): boolean;
  clearWordsPerMinute(): void;
  getWordsPerMinute(): number;
  setWordsPerMinute(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReadingTimeEstimate.AsObject;
  static toObject(includeInstance: boolean, msg: ReadingTimeEstimate): ReadingTimeEstimate.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ReadingTimeEstimate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReadingTimeEstimate;
  static deserializeBinaryFromReader(message: ReadingTimeEstimate, reader: jspb.BinaryReader): ReadingTimeEstimate;
}

export namespace ReadingTimeEstimate {
  export type AsObject = {
    minutes: number,
    seconds: number,
    wordsPerMinute: number,
    error: string,
  }
}

export class ConsensusGradeLevel extends jspb.Message {
  getGradeLabel(): string;
  setGradeLabel(value: string): void;

  hasGradeFloat(): boolean;
  clearGradeFloat(): void;
  getGradeFloat(): number;
  setGradeFloat(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConsensusGradeLevel.AsObject;
  static toObject(includeInstance: boolean, msg: ConsensusGradeLevel): ConsensusGradeLevel.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConsensusGradeLevel, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConsensusGradeLevel;
  static deserializeBinaryFromReader(message: ConsensusGradeLevel, reader: jspb.BinaryReader): ConsensusGradeLevel;
}

export namespace ConsensusGradeLevel {
  export type AsObject = {
    gradeLabel: string,
    gradeFloat: number,
    error: string,
  }
}

export class ReadabilityReport extends jspb.Message {
  hasCharacterCount(): boolean;
  clearCharacterCount(): void;
  getCharacterCount(): number;
  setCharacterCount(value: number): void;

  hasWordCount(): boolean;
  clearWordCount(): void;
  getWordCount(): number;
  setWordCount(value: number): void;

  hasSentenceCount(): boolean;
  clearSentenceCount(): void;
  getSentenceCount(): number;
  setSentenceCount(value: number): void;

  hasSyllableCount(): boolean;
  clearSyllableCount(): void;
  getSyllableCount(): number;
  setSyllableCount(value: number): void;

  hasPolysyllableCount(): boolean;
  clearPolysyllableCount(): void;
  getPolysyllableCount(): number;
  setPolysyllableCount(value: number): void;

  hasMonosyllableCount(): boolean;
  clearMonosyllableCount(): void;
  getMonosyllableCount(): number;
  setMonosyllableCount(value: number): void;

  hasDifficultWordCount(): boolean;
  clearDifficultWordCount(): void;
  getDifficultWordCount(): number;
  setDifficultWordCount(value: number): void;

  hasFleschReadingEase(): boolean;
  clearFleschReadingEase(): void;
  getFleschReadingEase(): number;
  setFleschReadingEase(value: number): void;

  hasFleschKincaidGrade(): boolean;
  clearFleschKincaidGrade(): void;
  getFleschKincaidGrade(): number;
  setFleschKincaidGrade(value: number): void;

  hasGunningFog(): boolean;
  clearGunningFog(): void;
  getGunningFog(): number;
  setGunningFog(value: number): void;

  hasSmogIndex(): boolean;
  clearSmogIndex(): void;
  getSmogIndex(): number;
  setSmogIndex(value: number): void;

  hasColemanLiauIndex(): boolean;
  clearColemanLiauIndex(): void;
  getColemanLiauIndex(): number;
  setColemanLiauIndex(value: number): void;

  hasAutomatedReadabilityIndex(): boolean;
  clearAutomatedReadabilityIndex(): void;
  getAutomatedReadabilityIndex(): number;
  setAutomatedReadabilityIndex(value: number): void;

  hasDaleChallScore(): boolean;
  clearDaleChallScore(): void;
  getDaleChallScore(): number;
  setDaleChallScore(value: number): void;

  hasLinsearWrite(): boolean;
  clearLinsearWrite(): void;
  getLinsearWrite(): number;
  setLinsearWrite(value: number): void;

  hasLix(): boolean;
  clearLix(): void;
  getLix(): number;
  setLix(value: number): void;

  hasRix(): boolean;
  clearRix(): void;
  getRix(): number;
  setRix(value: number): void;

  getConsensusGradeLabel(): string;
  setConsensusGradeLabel(value: string): void;

  hasConsensusGradeFloat(): boolean;
  clearConsensusGradeFloat(): void;
  getConsensusGradeFloat(): number;
  setConsensusGradeFloat(value: number): void;

  hasEstimatedReadingMinutes(): boolean;
  clearEstimatedReadingMinutes(): void;
  getEstimatedReadingMinutes(): number;
  setEstimatedReadingMinutes(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReadabilityReport.AsObject;
  static toObject(includeInstance: boolean, msg: ReadabilityReport): ReadabilityReport.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ReadabilityReport, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReadabilityReport;
  static deserializeBinaryFromReader(message: ReadabilityReport, reader: jspb.BinaryReader): ReadabilityReport;
}

export namespace ReadabilityReport {
  export type AsObject = {
    characterCount: number,
    wordCount: number,
    sentenceCount: number,
    syllableCount: number,
    polysyllableCount: number,
    monosyllableCount: number,
    difficultWordCount: number,
    fleschReadingEase: number,
    fleschKincaidGrade: number,
    gunningFog: number,
    smogIndex: number,
    colemanLiauIndex: number,
    automatedReadabilityIndex: number,
    daleChallScore: number,
    linsearWrite: number,
    lix: number,
    rix: number,
    consensusGradeLabel: string,
    consensusGradeFloat: number,
    estimatedReadingMinutes: number,
    error: string,
  }
}

