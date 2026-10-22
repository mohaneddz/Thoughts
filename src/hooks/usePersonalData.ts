'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { useHydrated } from '@/hooks/useHydrated';
import type { CheckInEntry, TestResultSummary } from '@/types/result';
import type { AnswerValue } from '@/types/common';
import type { SavedThought } from '@/types/user';
import {
  type PersonalDataSnapshot,
  STORAGE_KEY,
  type StoredTestDraft,
  readPersonalData,
  subscribeToPersonalData,
  writePersonalData,
} from '@/utils/storage/personalData';

function sortByDateDesc<T extends { createdAt?: string; updatedAt?: string }>(items: T[]) {
  return [...items].sort((left, right) => {
    const leftValue = left.createdAt ?? left.updatedAt ?? '';
    const rightValue = right.createdAt ?? right.updatedAt ?? '';
    return rightValue.localeCompare(leftValue);
  });
}

export function usePersonalData() {
  const isReady = useHydrated();
  const rawSnapshot = useSyncExternalStore(
    subscribeToPersonalData,
    () => {
      if (typeof window === 'undefined') {
        return '';
      }

      return window.localStorage.getItem(STORAGE_KEY) ?? '';
    },
    () => '',
  );

  const snapshot = useMemo(() => {
    let next: Partial<PersonalDataSnapshot>;
    try {
      next = rawSnapshot ? (JSON.parse(rawSnapshot) as Partial<PersonalDataSnapshot>) : readPersonalData();
    } catch {
      next = readPersonalData();
    }

    return {
      checkIns: sortByDateDesc(Array.isArray(next.checkIns) ? next.checkIns : []),
      results: sortByDateDesc(Array.isArray(next.results) ? next.results : []),
      savedThoughts: sortByDateDesc(Array.isArray(next.savedThoughts) ? next.savedThoughts : []),
      drafts: sortByDateDesc(Array.isArray(next.drafts) ? next.drafts : []),
    };
  }, [rawSnapshot]);

  const updateSnapshot = useCallback((updater: (current: PersonalDataSnapshot) => PersonalDataSnapshot) => {
    const next = updater(readPersonalData());
    writePersonalData(next);
  }, []);

  const saveCheckIn = useCallback((entry: CheckInEntry) => {
    updateSnapshot((current) => ({
      ...current,
      checkIns: sortByDateDesc([entry, ...current.checkIns.filter((item) => item.id !== entry.id)]),
    }));
  }, [updateSnapshot]);

  const saveResult = useCallback((result: TestResultSummary) => {
    updateSnapshot((current) => ({
      ...current,
      results: sortByDateDesc([result, ...current.results.filter((item) => item.id !== result.id)]),
    }));
  }, [updateSnapshot]);

  const saveThought = useCallback((thought: SavedThought) => {
    updateSnapshot((current) => ({
      ...current,
      savedThoughts: sortByDateDesc([thought, ...current.savedThoughts.filter((item) => item.id !== thought.id)]),
    }));
  }, [updateSnapshot]);

  const deleteResult = useCallback((id: string) => {
    updateSnapshot((current) => ({ ...current, results: current.results.filter((item) => item.id !== id) }));
  }, [updateSnapshot]);

  const deleteThought = useCallback((id: string) => {
    updateSnapshot((current) => ({ ...current, savedThoughts: current.savedThoughts.filter((item) => item.id !== id) }));
  }, [updateSnapshot]);

  const deleteCheckIn = useCallback((id: string) => {
    updateSnapshot((current) => ({ ...current, checkIns: current.checkIns.filter((item) => item.id !== id) }));
  }, [updateSnapshot]);

  /** Merges an imported snapshot into what is already stored; entries with an existing id are kept as they are. */
  const importSnapshot = useCallback((incoming: Partial<PersonalDataSnapshot>) => {
    let added = 0;
    const merge = <T extends { id: string; createdAt: string }>(existing: T[], extra: T[] | undefined) => {
      const known = new Set(existing.map((item) => item.id));
      const fresh = (extra ?? []).filter((item) => item && typeof item.id === 'string' && !known.has(item.id));
      added += fresh.length;
      return sortByDateDesc([...existing, ...fresh]);
    };

    updateSnapshot((current) => ({
      ...current,
      results: merge(current.results, incoming.results),
      checkIns: merge(current.checkIns, incoming.checkIns),
      savedThoughts: merge(current.savedThoughts, incoming.savedThoughts),
    }));

    return added;
  }, [updateSnapshot]);

  const saveDraft = useCallback((draft: { slug: string; answers: Record<string, AnswerValue>; index: number; mode?: 'full' | 'guided' }) => {
    const nextDraft: StoredTestDraft = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };

    updateSnapshot((current) => ({
      ...current,
      drafts: sortByDateDesc([nextDraft, ...current.drafts.filter((item) => item.slug !== draft.slug)]),
    }));
  }, [updateSnapshot]);

  const clearDraft = useCallback((slug: string) => {
    updateSnapshot((current) => ({
      ...current,
      drafts: current.drafts.filter((item) => item.slug !== slug),
    }));
  }, [updateSnapshot]);

  return {
    ...snapshot,
    isReady,
    saveCheckIn,
    saveResult,
    saveThought,
    saveDraft,
    clearDraft,
    deleteResult,
    deleteThought,
    deleteCheckIn,
    importSnapshot,
  };
}
