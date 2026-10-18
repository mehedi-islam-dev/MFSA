"use client";

import { useState, useRef } from "react";
import { FishSample } from "@/types";
import { Trash2, Plus, Download, Upload, Database } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpreadsheetTableProps {
  samples: FishSample[];
  onUpdate: (id: string, updates: Partial<FishSample>) => void;
  onDelete: (id: string) => void;
  onAdd: (s: Omit<FishSample, "id">) => void;
}

const COLUMNS = [
  { key: "totalLength", label: "Total Length (cm)", type: "number", required: true, min: 0 },
  { key: "forkLength", label: "Fork Length (cm)", type: "number", min: 0 },
  { key: "weight", label: "Weight (g)", type: "number", required: true, min: 0 },
  { key: "sex", label: "Sex", type: "select", options: ["", "M", "F", "U"] },
  { key: "maturityStage", label: "Maturity", type: "select", options: ["", "1", "2", "3", "4", "5"] },
  { key: "collectionDate", label: "Date", type: "date" },
  { key: "location", label: "Location", type: "text" },
  { key: "notes", label: "Notes", type: "text" },
] as const;

type ColKey = typeof COLUMNS[number]["key"];

const EMPTY_ROW: Omit<FishSample, "id"> = {
  totalLength: 0,
  weight: 0,
  species: "Lates calcarifer",
};

export default function SpreadsheetTable({ samples, onUpdate, onDelete, onAdd }: SpreadsheetTableProps) {
  const [newRow, setNewRow] = useState<Omit<FishSample, "id">>({ ...EMPTY_ROW });
  const [editingCell, setEditingCell] = useState<{ id: string; key: string } | null>(null);
  const addRowRef = useRef<HTMLTableRowElement>(null);

  // CSV Export
  const exportCSV = () => {
    const headers = COLUMNS.map((c) => c.label).join(",");
    const rows = samples.map((s) =>
      COLUMNS.map((c) => {
        const val = s[c.key as keyof FishSample] ?? "";
        return typeof val === "string" && val.includes(",") ? `"${val}"` : val;
      }).join(",")
    );
    const blob = new Blob([[headers, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fish-samples-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // CSV Import
  const importCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = (ev.target?.result as string).split("\n").filter(Boolean);
      lines.slice(1).forEach((line) => {
        const values = line.split(",");
        onAdd({
          totalLength: parseFloat(values[0]) || 0,
          forkLength: parseFloat(values[1]) || undefined,
          weight: parseFloat(values[2]) || 0,
          sex: (values[3]?.trim() as "M" | "F" | "U") || undefined,
          maturityStage: parseInt(values[4]) as 1 | undefined || undefined,
          collectionDate: values[5]?.trim() || undefined,
          location: values[6]?.trim() || undefined,
          notes: values[7]?.trim() || undefined,
          species: "Lates calcarifer",
        });
      });
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleCellChange = (id: string, key: ColKey, value: string) => {
    const parsed = COLUMNS.find((c) => c.key === key)?.type === "number"
      ? parseFloat(value) || 0
      : key === "maturityStage" ? (parseInt(value) || undefined)
      : value || undefined;
    onUpdate(id, { [key]: parsed });
  };

  const handleAddRow = () => {
    if (!newRow.totalLength || !newRow.weight) return;
    onAdd(newRow);
    setNewRow({ ...EMPTY_ROW });
    setTimeout(() => addRowRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
  };

  const handleNewRowChange = (key: ColKey, value: string) => {
    const parsed = COLUMNS.find((c) => c.key === key)?.type === "number"
      ? parseFloat(value) || 0
      : value || undefined;
    setNewRow((prev) => ({ ...prev, [key]: parsed }));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-sm text-[var(--color-ocean-200)]">
          <span className="badge-teal">{samples.length} rows</span>
          <span className="text-[var(--color-ocean-400)]">•</span>
          <span>Click any cell to edit</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="btn-secondary cursor-pointer text-xs">
            <Upload className="w-3.5 h-3.5" />
            Import CSV
            <input type="file" accept=".csv" onChange={importCSV} className="sr-only" aria-label="Import CSV" />
          </label>
          <button onClick={exportCSV} className="btn-secondary text-xs" type="button">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Scrollable table wrapper */}
      <div className="overflow-x-auto rounded-xl border border-[rgba(61,143,224,0.15)]" style={{ maxHeight: "calc(100vh - 340px)" }}>
        <table className="table-ocean min-w-[900px]">
          <thead className="sticky top-0 z-10">
            <tr>
              <th className="w-10">#</th>
              {COLUMNS.map((col) => (
                <th key={col.key}>
                  {col.label}
                  {("required" in col && col.required) && <span className="text-[var(--color-coral-400)] ml-1">*</span>}
                </th>
              ))}
              <th className="w-12">Del</th>
            </tr>
          </thead>
          <tbody>
            {samples.map((sample, idx) => (
              <tr key={sample.id} className="group">
                <td className="text-[var(--color-ocean-400)] text-xs text-center">{idx + 1}</td>
                {COLUMNS.map((col) => (
                  <td key={col.key}>
                    {col.type === "select" ? (
                      <select
                        value={String(sample[col.key as keyof FishSample] ?? "")}
                        onChange={(e) => handleCellChange(sample.id, col.key, e.target.value)}
                        className="w-full bg-transparent border border-transparent focus:border-[var(--color-teal-500)] rounded text-[13px] py-1 px-2 text-[#e2eaf4] outline-none cursor-pointer"
                        style={{ background: "rgba(4,20,36,0.6)" }}
                      >
                        {"options" in col && col.options.map((o) => (
                          <option key={o} value={o} style={{ background: "#041424" }}>{o || "—"}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={col.type}
                        value={String(sample[col.key as keyof FishSample] ?? "")}
                        onChange={(e) => handleCellChange(sample.id, col.key, e.target.value)}
                        onFocus={() => setEditingCell({ id: sample.id, key: col.key })}
                        onBlur={() => setEditingCell(null)}
                        className={cn(
                          editingCell?.id === sample.id && editingCell.key === col.key && "!border-[var(--color-teal-500)] !bg-[rgba(0,212,170,0.06)]"
                        )}
                        min={"min" in col ? col.min : undefined}
                        aria-label={`${col.label} for row ${idx + 1}`}
                      />
                    )}
                  </td>
                ))}
                <td>
                  <button
                    type="button"
                    onClick={() => onDelete(sample.id)}
                    className="flex items-center justify-center w-7 h-7 rounded text-[var(--color-ocean-400)] hover:text-[var(--color-coral-400)] hover:bg-[rgba(255,107,107,0.1)] transition-colors opacity-0 group-hover:opacity-100"
                    aria-label={`Delete row ${idx + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}

            {/* Add new row */}
            <tr ref={addRowRef} className="bg-[rgba(0,212,170,0.03)]">
              <td className="text-center text-[var(--color-teal-500)] text-xs font-bold">+</td>
              {COLUMNS.map((col) => (
                <td key={col.key}>
                  {col.type === "select" ? (
                    <select
                      value={String(newRow[col.key as keyof typeof newRow] ?? "")}
                      onChange={(e) => handleNewRowChange(col.key, e.target.value)}
                      className="w-full bg-transparent border border-[rgba(0,212,170,0.2)] rounded text-[13px] py-1 px-2 text-[#e2eaf4] outline-none"
                      style={{ background: "rgba(0,212,170,0.04)" }}
                    >
                      {"options" in col && col.options.map((o) => (
                        <option key={o} value={o} style={{ background: "#041424" }}>{o || "—"}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={col.type}
                      value={String(newRow[col.key as keyof typeof newRow] ?? "")}
                      onChange={(e) => handleNewRowChange(col.key, e.target.value)}
                      min={"min" in col ? col.min : undefined}
                      placeholder={"required" in col && col.required ? "Required" : "—"}
                      aria-label={`New row ${col.label}`}
                    />
                  )}
                </td>
              ))}
              <td>
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="flex items-center justify-center w-7 h-7 rounded bg-[rgba(0,212,170,0.15)] text-[var(--color-teal-400)] hover:bg-[rgba(0,212,170,0.25)] transition-colors"
                  aria-label="Add new row"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {samples.length === 0 && (
        <div className="text-center py-12 text-[var(--color-ocean-300)]">
          <Database className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No data yet. Load demo data or add rows above.</p>
        </div>
      )}
    </div>
  );
}


