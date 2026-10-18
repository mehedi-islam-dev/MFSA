"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Database, Download, Search, Table2 } from "lucide-react";

export default function InAppSpreadsheetPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const demoData = [
    { id: "MRA-001", date: "2024-03-05", species: "Tenualosa ilisha", length: 25.4, weight: 182, gear: "Gillnet", coords: "22.3569° N, 91.7832° E" },
    { id: "MRA-002", date: "2024-03-05", species: "Tenualosa ilisha", length: 27.8, weight: 231, gear: "Gillnet", coords: "22.3569° N, 91.7832° E" },
    { id: "MRA-003", date: "2024-03-06", species: "Tenualosa ilisha", length: 30.1, weight: 295, gear: "Purse Seine", coords: "22.1245° N, 91.6854° E" },
    { id: "MRA-004", date: "2024-03-06", species: "Tenualosa ilisha", length: 32.5, weight: 375, gear: "Purse Seine", coords: "22.1245° N, 91.6854° E" },
    { id: "MRA-005", date: "2024-03-07", species: "Tenualosa ilisha", length: 35.2, weight: 480, gear: "Gillnet", coords: "21.9542° N, 91.5031° E" },
    { id: "MRA-006", date: "2024-03-07", species: "Tenualosa ilisha", length: 37.9, weight: 598, gear: "Gillnet", coords: "21.9542° N, 91.5031° E" },
    { id: "MRA-007", date: "2024-03-08", species: "Pampus argenteus", length: 18.5, weight: 195, gear: "Trawl", coords: "22.5801° N, 91.9214° E" },
    { id: "MRA-008", date: "2024-03-08", species: "Pampus argenteus", length: 21.3, weight: 295, gear: "Trawl", coords: "22.5801° N, 91.9214° E" },
    { id: "MRA-009", date: "2024-03-09", species: "Rastrelliger kanagurta", length: 16.2, weight: 82, gear: "Purse Seine", coords: "21.7418° N, 91.8235° E" },
    { id: "MRA-010", date: "2024-03-09", species: "Rastrelliger kanagurta", length: 19.4, weight: 138, gear: "Purse Seine", coords: "21.7418° N, 91.8235° E" },
  ];

  const filteredData = demoData.filter(
    (row) =>
      row.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.gear.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#010409] text-[#00f0ff] font-mono overflow-y-auto pb-24 relative">
      {/* Background Cyber-Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-[0.05]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(0,240,255,0.05),transparent_60%)] blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-8 p-4 md:p-8 pt-8 md:pt-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-cyan-900/50 pb-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-[0.2em] text-[#00f0ff] drop-shadow-[0_0_15px_rgba(0,240,255,0.7)] uppercase flex items-center gap-3">
              <Table2 className="w-8 h-8 text-cyan-400" /> In-App Spreadsheet
            </h1>
            <p className="text-[10px] md:text-xs text-cyan-600 tracking-[0.3em] uppercase font-bold mt-2">
              Marine Stock Assessment Database
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-cyan-950/20 p-4 border border-cyan-900/50 rounded-xl">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500" />
            <input
              type="text"
              placeholder="Search Database..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#010811] border border-cyan-900/50 rounded-lg py-2.5 pl-10 pr-4 text-sm text-cyan-300 placeholder-cyan-800 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all"
            />
          </div>
          
          <button className="flex items-center gap-2 px-6 py-2.5 bg-cyan-950/40 border border-cyan-500/50 text-cyan-300 hover:text-[#00f0ff] hover:bg-cyan-900/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all rounded-lg text-xs tracking-widest uppercase font-bold w-full md:w-auto">
            <Download className="w-4 h-4" />
            Export to CSV
          </button>
        </div>

        {/* Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full overflow-hidden rounded-2xl border border-cyan-900/50 bg-[#010811]/80 backdrop-blur-md shadow-[0_0_30px_rgba(0,240,255,0.05)]"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-cyan-900/50 bg-cyan-950/30 text-cyan-500/80 text-[10px] uppercase tracking-widest">
                  <th className="p-4 font-bold">ID</th>
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold">Species</th>
                  <th className="p-4 font-bold">Length (cm)</th>
                  <th className="p-4 font-bold">Weight (g)</th>
                  <th className="p-4 font-bold">Gear Type</th>
                  <th className="p-4 font-bold">Location Coordinates</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredData.length > 0 ? (
                  filteredData.map((row, idx) => (
                    <tr
                      key={row.id}
                      className="border-b border-cyan-900/20 hover:bg-cyan-950/20 transition-colors"
                    >
                      <td className="p-4 text-cyan-400 font-bold">{row.id}</td>
                      <td className="p-4 text-cyan-100/70">{row.date}</td>
                      <td className="p-4 text-emerald-400 italic">{row.species}</td>
                      <td className="p-4 text-cyan-300">{row.length.toFixed(1)}</td>
                      <td className="p-4 text-cyan-300">{row.weight.toFixed(1)}</td>
                      <td className="p-4 text-purple-400">{row.gear}</td>
                      <td className="p-4 text-slate-400 text-xs tracking-wider">{row.coords}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-cyan-700 italic">
                      No records found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
