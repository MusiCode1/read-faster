import type { Progress, Word, WordSessionState } from '$lib/types';
import { CONFIG } from '$lib/constants/config';
import { loadProgress, saveProgress } from '$lib/utils/localStorage';

// פונקציית עזר לערבוב מערך
export function shuffle<T>(array: T[]): T[] {
	const newArray = [...array];
	for (let i = newArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
	}
	return newArray;
}

// ניהול סשן אימון
export const WordSession = {
	create(originalWords: Word[], repetitions: number, startIndex: number = 0): WordSessionState {
		// יוצרים את רשימת המילים עם החזרות
		const allWords = Array(repetitions).fill(originalWords).flat();

		// וידוא שהאינדקס ההתחלתי תקין
		const validStartIndex = Math.min(Math.max(0, startIndex), allWords.length - 1);

		return {
			words: allWords,
			currentIndex: validStartIndex,
			wordsPerRepetition: originalWords.length,
			totalRepetitions: repetitions
		};
	},

	next(state: WordSessionState): WordSessionState {
		if (state.currentIndex < state.words.length - 1) {
			return { ...state, currentIndex: state.currentIndex + 1 };
		}
		return state;
	},

	prev(state: WordSessionState): WordSessionState {
		if (state.currentIndex > 0) {
			return { ...state, currentIndex: state.currentIndex - 1 };
		}
		return state;
	},

	getCurrentRepetition(state: WordSessionState): number {
		return Math.floor(state.currentIndex / state.wordsPerRepetition) + 1;
	},

	getCurrentWord(state: WordSessionState): Word {
		// בדיקת תקינות האינדקס
		if (state.currentIndex < 0 || state.currentIndex >= state.words.length) {
			return state.words[0]; // החזרת המילה הראשונה כברירת מחדל
		}
		return state.words[state.currentIndex];
	},

	getProgress(state: WordSessionState): { current: number; total: number } {
		return {
			current: (state.currentIndex % state.wordsPerRepetition) + 1,
			total: state.wordsPerRepetition
		};
	},

	isComplete(state: WordSessionState): boolean {
		return state.currentIndex === state.words.length - 1;
	}
};

// חישובים ובדיקות תקינות
export const WordSetCalculator = {
	calculateTotalSets(words: Word[], wordsPerSet: number): number {
		const totalWords = words.length;
		return Math.ceil(totalWords / wordsPerSet);
	},

	getWordsForSet(words: Word[], set: number, wordsPerSet: number): Word[] {
		const startIndex = (set - 1) * wordsPerSet;
		return words.slice(startIndex, startIndex + wordsPerSet);
	},

	validateWordsPerSet(count: number): boolean {
		return count >= CONFIG.app.minWordsPerSet && count <= CONFIG.app.maxWordsPerSet;
	},

	validateSetNumber(setNumber: number, totalSets: number): boolean {
		return setNumber > 0 && setNumber <= totalSets;
	},

	validateRepetitions(repetitions: number): boolean {
		return repetitions >= CONFIG.app.minRepetitions && repetitions <= CONFIG.app.maxRepetitions;
	}
};

// ניהול התקדמות
export const WordProgress = {
	load(): Progress | null {
		return loadProgress();
	},

	save(
		currentSet: number,
		wordsPerSet: number,
		repetitionsPerSet: number = CONFIG.app.defaultRepetitions,
		hideAfterSeconds: number = CONFIG.app.defaultHideSeconds
	): void {
		const progress: Progress = { currentSet, wordsPerSet, repetitionsPerSet, hideAfterSeconds };
		saveProgress(progress);
	}
};

// פונקציות עזר
export const WordUtils = {
	removeNiqqud(text: string): string {
		return text
			.normalize('NFD')
			.replace(/[\u0591-\u05C7]/g, '') // הסרת ניקוד עברי
			.normalize('NFC');
	}
};
