"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Activity, Beaker, MapPin, Target } from 'lucide-react';
import { renderToString } from 'react-dom/server';

// Fix Leaflet default icon issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom glowing icons using Lucide React
const createNeonIcon = (color: string) => {
  const svgHtml = renderToString(
    <div style={{ color: color, filter: `drop-shadow(0 0 8px ${color})` }}>
      <MapPin size={28} />
    </div>
  );
  return L.divIcon({
    html: svgHtml,
    className: 'custom-neon-icon',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

const icons = {
  active: createNeonIcon('#00f0ff'), // cyan
  warning: createNeonIcon('#a855f7'), // purple
  success: createNeonIcon('#00ff66'), // green
};

// Data points for Chattogram Coast & Bay of Bengal
const STATIONS = [
  { id: 'S-01', name: 'Chattogram Port Approach', lat: 22.25, lng: 91.75, type: 'active', depth: '15m', edna: 'High Biodiversity' },
  { id: 'S-02', name: 'Kutubdia Channel', lat: 21.85, lng: 91.85, type: 'success', depth: '25m', edna: 'Optimal' },
  { id: 'S-03', name: 'Sandwip Coastal Waters', lat: 22.50, lng: 91.45, type: 'warning', depth: '10m', edna: 'Anomalous Signals' },
  { id: 'S-04', name: 'St. Martin\'s Coral Reef', lat: 20.62, lng: 92.32, type: 'active', depth: '12m', edna: 'Pristine' },
  { id: 'S-05', name: 'Deep Sea Zone Alpha', lat: 21.10, lng: 91.20, type: 'success', depth: '200m+', edna: 'Pelagic Dominant' },
];

function MapController() {
  const map = useMap();
  useEffect(() => {
    // Force map to invalidate size after render to avoid grey tiles
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map]);
  return null;
}

export default function GeospatialMap() {
  // Center roughly on Bay of Bengal / Chattogram coast
  const center: [number, number] = [21.8, 91.7];

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-cyan-900/50 shadow-[0_0_30px_rgba(0,240,255,0.1)] z-0">
      
      {/* Abyssal overlay for edges */}
      <div className="absolute inset-0 pointer-events-none z-[400] shadow-[inset_0_0_40px_rgba(1,4,9,1)]" />

      <MapContainer 
        center={center} 
        zoom={7} 
        style={{ width: '100%', height: '100%', background: '#010811' }}
        zoomControl={false}
      >
        <MapController />
        
        {/* CartoDB Dark Matter Base Map */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Draw hypothetical eDNA density heat zones using CircleMarkers */}
        <CircleMarker center={[21.85, 91.85]} radius={60} pathOptions={{ color: '#00ff66', fillColor: '#00ff66', fillOpacity: 0.1, weight: 1 }} />
        <CircleMarker center={[22.50, 91.45]} radius={40} pathOptions={{ color: '#a855f7', fillColor: '#a855f7', fillOpacity: 0.15, weight: 1 }} />
        <CircleMarker center={[21.10, 91.20]} radius={90} pathOptions={{ color: '#00f0ff', fillColor: '#00f0ff', fillOpacity: 0.08, weight: 1 }} />

        {/* Stations */}
        {STATIONS.map(station => (
          <Marker 
            key={station.id} 
            position={[station.lat, station.lng]} 
            icon={icons[station.type as keyof typeof icons]}
          >
            <Popup className="abyssal-popup">
              <div className="bg-[#010811] text-[#00f0ff] p-3 border border-cyan-500/40 rounded-xl font-mono min-w-[200px] shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                <div className="flex items-center justify-between border-b border-cyan-900/50 pb-2 mb-2">
                  <span className="text-xs font-black tracking-widest">{station.id}</span>
                  <Target className="w-4 h-4 text-cyan-400" />
                </div>
                <h3 className="font-bold text-sm text-white mb-3">{station.name}</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lat/Lng</span>
                    <span className="text-cyan-300">{station.lat.toFixed(2)}, {station.lng.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Depth</span>
                    <span className="text-purple-300">{station.depth}</span>
                  </div>
                  <div className="flex justify-between pt-1 mt-1 border-t border-cyan-900/30">
                    <span className="text-slate-500">eDNA Signal</span>
                    <span className={station.type === 'warning' ? 'text-purple-400 font-bold' : 'text-green-400 font-bold'}>
                      {station.edna}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
