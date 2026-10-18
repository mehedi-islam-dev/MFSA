"use client";
import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import * as XLSX from 'xlsx';
import type { CoordinatePoint } from '@/components/Map/DynamicMap';

const GeospatialMap = dynamic(
  () => import('@/components/Map/DynamicMap'),
  { ssr: false, loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[#030508]">
      <div className="text-cyan-500 animate-pulse font-mono tracking-widest text-sm">INITIALIZING GIS ARRAY...</div>
    </div>
  )}
);

// ─── Column name heuristics ──────────────────────────────────────────────────
const LAT_KEYS = ['lat', 'latitude', 'Lat', 'Latitude', 'LAT', 'LATITUDE'];
const LNG_KEYS = ['lng', 'lon', 'long', 'longitude', 'Lng', 'Lon', 'Long', 'Longitude', 'LNG', 'LON', 'LONG', 'LONGITUDE'];

function findKey(headers: string[], candidates: string[]): string | undefined {
  return headers.find((h) => candidates.includes(h.trim()));
}

// ─── Bay of Bengal eDNA Sampling Stations (demo dataset) ─────────────────────
const DEMO_MAP_STATIONS: CoordinatePoint[] = [
  { lat: 22.3569, lng: 91.7832, name: "Station Alpha — Karnaphuli Estuary" },
  { lat: 22.1245, lng: 91.6854, name: "Station Beta — Cox's Bazar Coastal" },
  { lat: 21.9542, lng: 91.5031, name: "Station Gamma — Sangu River Mouth" },
  { lat: 22.5801, lng: 91.9214, name: "Station Delta — Feni River Estuary" },
  { lat: 21.7418, lng: 91.8235, name: "Station Epsilon — Teknaf Deep Zone" },
  { lat: 22.7033, lng: 91.8603, name: "Station Zeta — Noakhali Offshore" },
  { lat: 22.4478, lng: 91.3952, name: "Station Eta — Chittagong Hill Runoff" },
  { lat: 21.5628, lng: 91.9876, name: "Station Theta — St. Martin's Reef" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function eDNAMapperPage() {
  const [activeLayer, setActiveLayer] = useState('eDNA Biodiversity');
  const [coordinates, setCoordinates] = useState<CoordinatePoint[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── File parsing ───────────────────────────────────────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('PARSING...');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Use first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

        if (rows.length === 0) {
          setUploadStatus('ERROR: Empty sheet');
          return;
        }

        const headers = Object.keys(rows[0]);
        const latKey = findKey(headers, LAT_KEYS);
        const lngKey = findKey(headers, LNG_KEYS);

        if (!latKey || !lngKey) {
          setUploadStatus(
            `ERROR: Could not find Lat/Lng columns. Found: ${headers.join(', ')}`
          );
          return;
        }

        // Possible "station name" columns
        const nameKey = headers.find((h) =>
          ['name', 'Name', 'station', 'Station', 'label', 'Label', 'site', 'Site'].includes(h.trim())
        );

        const points: CoordinatePoint[] = rows
          .map((row) => {
            const lat = parseFloat(String(row[latKey]));
            const lng = parseFloat(String(row[lngKey]));
            if (isNaN(lat) || isNaN(lng)) return null;
            const pt: CoordinatePoint = { lat, lng };
            if (nameKey) pt.name = String(row[nameKey]);
            return pt;
          })
          .filter((p): p is CoordinatePoint => p !== null);

        setCoordinates(points);
        setUploadStatus(`✓ ${points.length} STATIONS LOADED`);
      } catch {
        setUploadStatus('ERROR: Failed to parse file');
      }
    };

    reader.readAsArrayBuffer(file);
    // Reset so the same file can be re-uploaded if needed
    e.target.value = '';
  };

  const clearData = () => {
    setCoordinates([]);
    setUploadStatus(null);
  };

  // ─── Load hardcoded Bay of Bengal demo stations ─────────────────────────────
  const loadDemoMapData = () => {
    setCoordinates(DEMO_MAP_STATIONS);
    setUploadStatus(`✓ ${DEMO_MAP_STATIONS.length} DEMO STATIONS LOADED`);
  };

  return (
    <div className="min-h-screen bg-[#060a10] text-cyan-500 p-8 flex flex-col font-mono">
      {/* Header Section */}
      <header className="mb-8 border-b border-cyan-900 pb-6">
        <h1 className="text-3xl font-bold text-cyan-300 tracking-[0.2em] uppercase flex items-center gap-3">
          <span className="text-4xl text-cyan-400">🌍</span> eDNA MAPPER NODE
        </h1>
        <p className="mt-4 text-cyan-600 text-sm max-w-4xl leading-relaxed border-l-2 border-cyan-800 pl-4 tracking-wide">
          Real-time ecosystem modeling with eDNA biodiversity mapping, microplastics simulation, 
          bioacoustic species identification, and satellite-linked trophic web analytics. 
          The most advanced marine intelligence platform ever built.
        </p>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        
        {/* Map Layers Sidebar */}
        <div className="w-full lg:w-1/4 bg-[#0a111a] border border-cyan-900/50 rounded-xl p-6 shadow-[0_0_15px_rgba(0,255,255,0.05)] flex flex-col gap-6">
          
          {/* Layer buttons */}
          <div>
            <h2 className="text-lg text-cyan-500 mb-6 border-b border-cyan-900/50 pb-2 tracking-[0.1em]">ACTIVE MAP LAYERS</h2>
            <div className="flex flex-col gap-4">
              {['eDNA Biodiversity', 'Microplastics', 'Bioacoustics', 'Satellite Analytics'].map((layer) => (
                <button
                  key={layer}
                  onClick={() => setActiveLayer(layer)}
                  className={`p-4 text-left rounded-lg border transition-all duration-300 flex justify-between items-center ${
                    activeLayer === layer 
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.2)] text-cyan-300' 
                      : 'bg-transparent border-cyan-900 text-cyan-700 hover:border-cyan-700 hover:bg-cyan-950/20'
                  }`}
                >
                  <span className="text-sm tracking-wider">{layer}</span>
                  {activeLayer === layer && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Data Upload Panel ─────────────────────────────────────────── */}
          <div className="border-t border-cyan-900/50 pt-6">
            <h3 className="text-xs text-cyan-700 mb-4 tracking-widest">DATA INGESTION</h3>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
              id="excel-upload-input"
            />

            {/* Stylised upload button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="
                w-full relative group overflow-hidden
                rounded-lg border border-cyan-500/60 bg-[#05080d]
                px-4 py-3 text-xs tracking-[0.15em] text-cyan-400 font-bold
                transition-all duration-300
                hover:border-cyan-400 hover:text-cyan-300
                hover:shadow-[0_0_18px_rgba(34,211,238,0.35)]
                active:scale-[0.98]
              "
            >
              {/* Animated shimmer on hover */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent pointer-events-none" />
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M8 12l4-4m0 0l4 4m-4-4v8" />
                </svg>
                UPLOAD EXCEL / CSV
              </span>
            </button>

            {/* ── Load Demo Data button ──────────────────────────────────── */}
            <button
              onClick={loadDemoMapData}
              className="
                mt-3 w-full relative group overflow-hidden
                rounded-lg border border-emerald-500/50 bg-[#03100a]
                px-4 py-3 text-xs tracking-[0.15em] text-emerald-400 font-bold
                transition-all duration-300
                hover:border-emerald-400 hover:text-emerald-300
                hover:shadow-[0_0_18px_rgba(52,211,153,0.4)]
                active:scale-[0.98]
              "
            >
              {/* Shimmer */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent pointer-events-none" />
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-10l6-3m0 16l5.447-2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 13V7" />
                </svg>
                LOAD DEMO DATA
              </span>
            </button>

            {/* Status / feedback */}
            {uploadStatus && (
              <div
                className={`mt-3 flex items-start gap-2 text-[10px] p-3 rounded border ${
                  uploadStatus.startsWith('ERROR')
                    ? 'border-red-800/60 bg-red-950/20 text-red-400'
                    : uploadStatus === 'PARSING...'
                    ? 'border-cyan-800/40 bg-cyan-950/20 text-cyan-600 animate-pulse'
                    : 'border-emerald-800/60 bg-emerald-950/20 text-emerald-400'
                }`}
              >
                <span className="tracking-wider break-all">{uploadStatus}</span>
              </div>
            )}

            {/* Clear button */}
            {coordinates.length > 0 && (
              <button
                onClick={clearData}
                className="mt-3 w-full text-[10px] tracking-widest text-cyan-800 hover:text-cyan-600 transition-colors py-1 border border-cyan-900/30 rounded hover:border-cyan-700/40"
              >
                CLEAR DATA
              </button>
            )}
          </div>

          {/* System Status */}
          <div className="border-t border-cyan-900/50 pt-6 mt-auto">
            <h3 className="text-xs text-cyan-700 mb-3 tracking-widest">SYSTEM STATUS</h3>
            <div className="flex items-center gap-3 text-xs bg-[#05080d] p-3 rounded border border-cyan-900/30">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-500 tracking-[0.2em]">GIS ENGINE ONLINE</span>
            </div>
          </div>
        </div>

        {/* GIS Map Display Area */}
        <div className="flex-1 bg-[#030508] border border-cyan-900/60 rounded-xl relative overflow-hidden shadow-[inset_0_0_50px_rgba(0,255,255,0.03)] z-0">
          
          <GeospatialMap activeLayer={activeLayer} coordinates={coordinates} />

          {/* Floating UI Overlays */}
          <div className="absolute top-4 left-4 z-[400] bg-[#060a10]/80 p-4 rounded-xl border border-cyan-900/50 backdrop-blur-sm pointer-events-none">
            <h2 className="text-lg text-cyan-300 tracking-[0.2em] mb-1 font-bold">GIS SATELLITE LINK</h2>
            <p className="text-cyan-600 text-[10px] tracking-widest uppercase">
              Rendering Layer: <span className="text-cyan-400 font-bold">{activeLayer}</span>
            </p>
            {coordinates.length > 0 && (
              <p className="text-emerald-500 text-[10px] tracking-widest mt-1">
                ● {coordinates.length} STATIONS ACTIVE
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
