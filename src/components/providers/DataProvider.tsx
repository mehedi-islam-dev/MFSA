"use client";

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { toast } from "sonner";
import { calculateLWR, calculateFultonCondition, LWRParams } from "@/lib/marineMath";

export interface FishRecord {
  id: string;
  species: string;
  length: number; // cm
  weight: number; // g
  date?: string;  // ISO date string (optional, for CSV export)
  location?: string; // (optional)
}

interface DataContextType {
  fishRecords: FishRecord[];
  setFishRecords: (records: FishRecord[]) => void;
  loadDemoData: () => void;
  addRecord: (record: Omit<FishRecord, "id">) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  isLoading: boolean;
  lwrParams: LWRParams;
  avgConditionFactor: number;
  aiSummary: string | null;
  setAiSummary: (summary: string | null) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [fishRecords, setFishRecords] = useState<FishRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await fetch("/api/records");
        if (!res.ok) {
          console.warn("API unavailable: returning empty records.");
          setFishRecords([]); // Fallback to empty state
          return; 
        }
        const data = await res.json();
        setFishRecords(data);
      } catch (error) {
        console.warn("API unavailable: returning empty records.", error);
        setFishRecords([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const lwrParams = useMemo(() => {
    if (fishRecords.length > 0) {
      return calculateLWR(fishRecords);
    }
    return { a: 0, b: 0, r2: 0 };
  }, [fishRecords]);

  const avgConditionFactor = useMemo(() => {
    if (fishRecords.length > 0) {
      const totalK = fishRecords.reduce((sum, r) => sum + calculateFultonCondition(r.length, r.weight), 0);
      return totalK / fishRecords.length;
    }
    return 0;
  }, [fishRecords]);

  useEffect(() => {
    // Clear AI summary when data changes significantly
    setAiSummary(null);
  }, [fishRecords]);

  const addRecord = async (record: Omit<FishRecord, "id">) => {
    try {
      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      if (!res.ok) throw new Error("Failed to add record");
      
      const newRecord = await res.json();
      setFishRecords((prev) => [newRecord, ...prev]);
      toast.success("Saved to Database", { description: `Record for ${newRecord.species} added successfully.` });
    } catch (error) {
      console.error("Failed to add record", error);
      toast.error("Failed to save record to Database.");
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      const res = await fetch(`/api/records?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete record");

      setFishRecords((prev) => prev.filter((r) => r.id !== id));
      toast.success("Record Deleted");
    } catch (error) {
      console.error("Failed to delete record", error);
      toast.error("Failed to delete record from Database.");
    }
  };

  // ── Realistic Hilsa (Tenualosa ilisha) demo dataset ────────────────────────
  // Based on published LWR: a=0.0053, b=3.12 (FishBase, Bay of Bengal stock)
  // 25 specimens across key Chattogram/Meghna estuarine sites, March–April 2024
  const loadDemoData = async () => {
    const hilsaRecords: FishRecord[] = [
      { id: `demo-1-${Date.now()}`,  species: "Tenualosa ilisha", length: 25.4, weight: 182,  date: "2024-03-05" },
      { id: `demo-2-${Date.now()}`,  species: "Tenualosa ilisha", length: 27.8, weight: 231,  date: "2024-03-05" },
      { id: `demo-3-${Date.now()}`,  species: "Tenualosa ilisha", length: 30.1, weight: 295,  date: "2024-03-06" },
      { id: `demo-4-${Date.now()}`,  species: "Tenualosa ilisha", length: 32.5, weight: 375,  date: "2024-03-06" },
      { id: `demo-5-${Date.now()}`,  species: "Tenualosa ilisha", length: 35.2, weight: 480,  date: "2024-03-07" },
      { id: `demo-6-${Date.now()}`,  species: "Tenualosa ilisha", length: 37.9, weight: 598,  date: "2024-03-07" },
      { id: `demo-7-${Date.now()}`,  species: "Tenualosa ilisha", length: 40.3, weight: 730,  date: "2024-03-08" },
      { id: `demo-8-${Date.now()}`,  species: "Tenualosa ilisha", length: 42.6, weight: 870,  date: "2024-03-08" },
      { id: `demo-9-${Date.now()}`,  species: "Tenualosa ilisha", length: 44.1, weight: 975,  date: "2024-03-09" },
      { id: `demo-10-${Date.now()}`, species: "Tenualosa ilisha", length: 46.8, weight: 1140, date: "2024-03-09" },
      { id: `demo-11-${Date.now()}`, species: "Tenualosa ilisha", length: 29.3, weight: 268,  date: "2024-03-12" },
      { id: `demo-12-${Date.now()}`, species: "Tenualosa ilisha", length: 31.7, weight: 342,  date: "2024-03-12" },
      { id: `demo-13-${Date.now()}`, species: "Tenualosa ilisha", length: 34.0, weight: 434,  date: "2024-03-13" },
      { id: `demo-14-${Date.now()}`, species: "Tenualosa ilisha", length: 36.5, weight: 545,  date: "2024-03-13" },
      { id: `demo-15-${Date.now()}`, species: "Tenualosa ilisha", length: 39.2, weight: 680,  date: "2024-03-14" },
      { id: `demo-16-${Date.now()}`, species: "Tenualosa ilisha", length: 41.8, weight: 820,  date: "2024-03-14" },
      { id: `demo-17-${Date.now()}`, species: "Tenualosa ilisha", length: 43.5, weight: 930,  date: "2024-03-15" },
      { id: `demo-18-${Date.now()}`, species: "Tenualosa ilisha", length: 47.9, weight: 1235, date: "2024-03-15" },
      { id: `demo-19-${Date.now()}`, species: "Tenualosa ilisha", length: 50.2, weight: 1420, date: "2024-03-18" },
      { id: `demo-20-${Date.now()}`, species: "Tenualosa ilisha", length: 52.6, weight: 1650, date: "2024-03-18" },
      { id: `demo-21-${Date.now()}`, species: "Pampus argenteus",  length: 18.5, weight: 195,  date: "2024-04-02" },
      { id: `demo-22-${Date.now()}`, species: "Pampus argenteus",  length: 21.3, weight: 295,  date: "2024-04-02" },
      { id: `demo-23-${Date.now()}`, species: "Pampus argenteus",  length: 23.8, weight: 418,  date: "2024-04-03" },
      { id: `demo-24-${Date.now()}`, species: "Rastrelliger kanagurta", length: 16.2, weight: 82,  date: "2024-04-05" },
      { id: `demo-25-${Date.now()}`, species: "Rastrelliger kanagurta", length: 19.4, weight: 138, date: "2024-04-05" },
    ];

    setFishRecords((prev) => {
      const combined = [...hilsaRecords, ...prev];
      return combined;
    });
    toast.success("Bay of Bengal Demo Data Loaded", {
      description: "25 specimens loaded — Hilsa, Silver Pomfret & Indian Mackerel.",
    });
  };

  return (
    <DataContext.Provider value={{ fishRecords, setFishRecords, loadDemoData, addRecord, deleteRecord, isLoading, lwrParams, avgConditionFactor, aiSummary, setAiSummary, isAdmin, setIsAdmin }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
