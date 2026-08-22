import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { storage } from "@/src/utils/storage";

export type HistoryItem = {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
};

export type RecentItem = {
  id: string; // tool id
  timestamp: number;
};

const HISTORY_KEY = "calc.history";
const FAV_KEY = "calc.favorites";
const RECENT_KEY = "calc.recents";

const MAX_HISTORY = 200;
const MAX_RECENTS = 12;

async function loadArray<T>(key: string): Promise<T[]> {
  const raw = await storage.getItem<string>(key, "");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

async function saveArray<T>(key: string, value: T[]): Promise<void> {
  await storage.setItem(key, JSON.stringify(value));
}

type AppDataValue = {
  ready: boolean;
  history: HistoryItem[];
  favorites: string[];
  recents: RecentItem[];
  addHistory: (expression: string, result: string) => void;
  deleteHistory: (id: string) => void;
  clearHistory: () => void;
  toggleFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
  addRecent: (toolId: string) => void;
  clearRecents: () => void;
};

const AppDataContext = createContext<AppDataValue | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recents, setRecents] = useState<RecentItem[]>([]);

  useEffect(() => {
    (async () => {
      const [h, f, r] = await Promise.all([
        loadArray<HistoryItem>(HISTORY_KEY),
        loadArray<string>(FAV_KEY),
        loadArray<RecentItem>(RECENT_KEY),
      ]);
      setHistory(h);
      setFavorites(f);
      setRecents(r);
      setReady(true);
    })();
  }, []);

  const addHistory = useCallback((expression: string, result: string) => {
    setHistory((prev) => {
      const item: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        expression,
        result,
        timestamp: Date.now(),
      };
      const next = [item, ...prev].slice(0, MAX_HISTORY);
      saveArray(HISTORY_KEY, next);
      return next;
    });
  }, []);

  const deleteHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((h) => h.id !== id);
      saveArray(HISTORY_KEY, next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveArray(HISTORY_KEY, []);
  }, []);

  const toggleFavorite = useCallback((toolId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId];
      saveArray(FAV_KEY, next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (toolId: string) => favorites.includes(toolId),
    [favorites],
  );

  const addRecent = useCallback((toolId: string) => {
    setRecents((prev) => {
      const filtered = prev.filter((r) => r.id !== toolId);
      const next = [{ id: toolId, timestamp: Date.now() }, ...filtered].slice(
        0,
        MAX_RECENTS,
      );
      saveArray(RECENT_KEY, next);
      return next;
    });
  }, []);

  const clearRecents = useCallback(() => {
    setRecents([]);
    saveArray(RECENT_KEY, []);
  }, []);

  const value = useMemo<AppDataValue>(
    () => ({
      ready,
      history,
      favorites,
      recents,
      addHistory,
      deleteHistory,
      clearHistory,
      toggleFavorite,
      isFavorite,
      addRecent,
      clearRecents,
    }),
    [
      ready,
      history,
      favorites,
      recents,
      addHistory,
      deleteHistory,
      clearHistory,
      toggleFavorite,
      isFavorite,
      addRecent,
      clearRecents,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
