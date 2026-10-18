"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface CoordinatePoint {
  lat: number;
  lng: number;
  /** Optional label shown in the popup – falls back to "Station N" */
  name?: string;
}

interface DynamicMapProps {
  activeLayer?: string;
  coordinates?: CoordinatePoint[];
}

// ─── Glowing neon-cyan divIcon ────────────────────────────────────────────────
function createNeonDotIcon(): L.DivIcon {
  return L.divIcon({
    className: '', // prevent leaflet default white-box styling
    html: `<div style="
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #22d3ee;
      box-shadow:
        0 0 6px 2px #22d3ee,
        0 0 14px 5px rgba(34,211,238,0.6),
        0 0 28px 8px rgba(34,211,238,0.3);
      border: 2px solid rgba(255,255,255,0.35);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });
}

// ─── Fallback marker for the default station ─────────────────────────────────
const defaultStationIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// ─── Apply CSS dark filter to the OSM tile pane ──────────────────────────────
// react-leaflet's TileLayer `style` prop does NOT cascade to individual tiles.
// The only reliable way is to mutate the tile pane element after map init.
function TileLayerFilter() {
  const map = useMap();
  useEffect(() => {
    const pane = map.getPane('tilePane') as HTMLElement | undefined;
    if (pane) {
      pane.style.filter =
        'invert(100%) hue-rotate(180deg) brightness(80%) contrast(120%)';
    }
  }, [map]);
  return null;
}

// ─── Force map resize on mount ────────────────────────────────────────────────
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DynamicMap({ activeLayer, coordinates = [] }: DynamicMapProps) {
  const center: [number, number] = [22.3569, 91.7832];
  const zoom = 8;

  // Free OpenStreetMap tiles — inverted + hue-rotated for Abyssal Futurism dark theme
  const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  const neonDotIcon = createNeonDotIcon();

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%', background: '#030508' }}
      zoomControl={false}
    >
      {/* OSM tile layer – filter applied via TileLayerFilter to the pane element */}
      <TileLayer
        url={TILE_URL}
        attribution={ATTRIBUTION}
      />

      {/* Applies dark 'Abyssal Futurism' filter to the tile pane – no API key needed */}
      <TileLayerFilter />

      {/* Default sampling station marker – shown when no data is uploaded */}
      {coordinates.length === 0 && (
        <Marker position={center} icon={defaultStationIcon}>
          <Popup className="abyssal-popup">
            <div className="bg-[#0a111a] border border-cyan-500/50 p-3 rounded-lg text-cyan-400 font-mono text-xs shadow-[0_0_15px_rgba(0,255,255,0.2)]">
              <h4 className="font-bold border-b border-cyan-900 pb-1 mb-2 tracking-widest uppercase">
                Station S-01
              </h4>
              <p className="text-cyan-600">Chattogram Coast</p>
              {activeLayer && (
                <p className="mt-2 text-cyan-300 font-bold border-t border-cyan-900/50 pt-1">
                  Data: {activeLayer}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      )}

      {/* Dynamically rendered markers from uploaded Excel / CSV data */}
      {coordinates.map((point, idx) => (
        <Marker
          key={`${point.lat}-${point.lng}-${idx}`}
          position={[point.lat, point.lng]}
          icon={neonDotIcon}
        >
          <Popup className="abyssal-popup">
            <div className="bg-[#0a111a] border border-cyan-500/50 p-3 rounded-lg text-cyan-400 font-mono text-xs shadow-[0_0_15px_rgba(0,255,255,0.2)]">
              <h4 className="font-bold border-b border-cyan-900 pb-1 mb-2 tracking-widest uppercase">
                {point.name ?? `Station ${idx + 1}`}
              </h4>
              <p className="text-cyan-600">
                {point.lat.toFixed(5)}, {point.lng.toFixed(5)}
              </p>
              {activeLayer && (
                <p className="mt-2 text-cyan-300 font-bold border-t border-cyan-900/50 pt-1">
                  Layer: {activeLayer}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      <MapResizer />
    </MapContainer>
  );
}
