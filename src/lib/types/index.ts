import type { Readable } from 'svelte/store';

export interface WordState {
  wordsPerSet: number;
  currentSet: number;
  currentWordIndex: number;
  totalSets: number;
  currentSetWords: string[];
  totalWords: number;
}

export interface WordSessionState {
  words: Word[]; // רשימת המילים המלאה כולל חזרות
  currentIndex: number; // האינדקס הנוכחי
  wordsPerRepetition: number; // כמה מילים בכל חזרה
  totalRepetitions: number; // כמה חזרות סה"כ
}

export type DerivedBoolean = Readable<boolean>;

export interface Progress {
  currentSet: number;
  wordsPerSet: number;
  repetitionsPerSet: number;
  hideAfterSeconds: number;
}

export interface Word {
  text: string; // המילה עם ניקוד
  image?: string | false; // נתיב לתמונה (אופציונלי)
  level: number; // רמת הקושי
  type?: 'verb'; // סוג המילה
}

export type WordList = Word[];
