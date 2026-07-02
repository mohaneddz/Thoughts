import type { CheckInEntry, TestResultSummary } from '@/types/result';
import type { AnswerValue } from '@/types/common';
import type { SavedThought } from '@/types/user';

export interface StoredTestDraft {
  slug: string;
  answers: Record<string, AnswerValue>;
  index: number;
  updatedAt: string;
}

export interface PersonalDataSnapshot {
  checkIns: CheckInEntry[];
  results: TestResultSummary[];
  savedThoughts: SavedThought[];
  drafts: StoredTestDraft[];
}

const STORAGE_KEY = 'thoughts.personal-data.v1';
const STORAGE_EVENT = 'thoughts:personal-data';

const emptySnapshot: PersonalDataSnapshot = {
  checkIns: [],
  results: [],
  savedThoughts: [],
  drafts: [],
};

function isBrowser() {
  return typeof window !== 'undefined';
}

export function readPersonalData(): PersonalDataSnapshot {
  if (!isBrowser()) {
    return emptySnapshot;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptySnapshot;
    }

    const parsed = JSON.parse(raw) as Partial<PersonalDataSnapshot>;
    return {
      checkIns: Array.isArray(parsed.checkIns) ? parsed.checkIns : [],
      results: Array.isArray(parsed.results) ? parsed.results : [],
      savedThoughts: Array.isArray(parsed.savedThoughts) ? parsed.savedThoughts : [],
      drafts: Array.isArray(parsed.drafts) ? parsed.drafts : [],
    };
  } catch {
    return emptySnapshot;
  }
}

export function writePersonalData(snapshot: PersonalDataSnapshot) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function subscribeToPersonalData(onStoreChange: () => void) {
  if (!isBrowser()) {
    return () => {};
  }

  const listener = () => onStoreChange();
  window.addEventListener('storage', listener);
  window.addEventListener(STORAGE_EVENT, listener);

  return () => {
    window.removeEventListener('storage', listener);
    window.removeEventListener(STORAGE_EVENT, listener);
  };
}
