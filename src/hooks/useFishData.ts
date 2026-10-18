"use client";

import { useState, useEffect, useCallback } from "react";
import { FishSample } from "@/types";
import { DEMO_DATA } from "@/lib/demo-data";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "marine_analytica_samples";

// ============================================================
// useFishData — Central data hook for both guest and auth modes
// Guest: persists to localStorage
// Auth:  syncs with /api/fish-samples
// ============================================================

interface UseFishDataReturn {
  samples: FishSample[];
  isGuest: boolean;
  isLoading: boolean;
  loadDemoData: () => void;
  addSample: (s: Omit<FishSample, "id">) => void;
  updateSample: (id: string, updates: Partial<FishSample>) => void;
  deleteSample: (id: string) => void;
  clearSamples: () => void;
  importSamples: (rows: Omit<FishSample, "id">[]) => void;
}

export function useFishData(isAuthenticated = false): UseFishDataReturn {
  const [samples, setSamples] = useState<FishSample[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isGuest = !isAuthenticated;

  // Load initial data
  useEffect(() => {
    if (isGuest) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setSamples(JSON.parse(stored));
        } catch {
          setSamples([]);
        }
      }
      setIsLoading(false);
    } else {
      // Authenticated: fetch from API
      fetch("/api/fish-samples")
        .then((r) => r.json())
        .then((data) => setSamples(data.samples ?? []))
        .catch(() => setSamples([]))
        .finally(() => setIsLoading(false));
    }
  }, [isAuthenticated, isGuest]);

  // Persist to localStorage for guest users
  const persist = useCallback(
    (data: FishSample[]) => {
      if (isGuest) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    },
    [isGuest]
  );

  const loadDemoData = useCallback(() => {
    setSamples(DEMO_DATA);
    persist(DEMO_DATA);
  }, [persist]);

  const addSample = useCallback(
    (s: Omit<FishSample, "id">) => {
      const newSample: FishSample = { ...s, id: uuidv4() };
      setSamples((prev) => {
        const next = [...prev, newSample];
        persist(next);
        if (!isGuest) {
          fetch("/api/fish-samples", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSample),
          }).catch(console.error);
        }
        return next;
      });
    },
    [isGuest, persist]
  );

  const updateSample = useCallback(
    (id: string, updates: Partial<FishSample>) => {
      setSamples((prev) => {
        const next = prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const deleteSample = useCallback(
    (id: string) => {
      setSamples((prev) => {
        const next = prev.filter((s) => s.id !== id);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const clearSamples = useCallback(() => {
    setSamples([]);
    persist([]);
  }, [persist]);

  const importSamples = useCallback(
    (rows: Omit<FishSample, "id">[]) => {
      const newSamples = rows.map((r) => ({ ...r, id: uuidv4() }));
      setSamples((prev) => {
        const next = [...prev, ...newSamples];
        persist(next);
        return next;
      });
    },
    [persist]
  );

  return {
    samples,
    isGuest,
    isLoading,
    loadDemoData,
    addSample,
    updateSample,
    deleteSample,
    clearSamples,
    importSamples,
  };
}
