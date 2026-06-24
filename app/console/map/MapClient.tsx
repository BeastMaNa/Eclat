"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Venue, AdminMachine, VenueStatus } from "@/lib/admin/types";
import type { ExpansionTarget } from "@/lib/admin/expansion-targets";

interface VenueWithMachines extends Venue {
  machines: AdminMachine[];
  revenueGbp: number;
}

interface Props {
  venues: VenueWithMachines[];
  colourMode: "status" | "performance";
  expansionTargets?: ExpansionTarget[];
}

const STATUS_COLOUR: Record<VenueStatus, string> = {
  "live": "#4ade80",
  "install-pending": "#facc15",
  "paused": "#94a3b8",
};

const STATUS_LABEL: Record<VenueStatus, string> = {
  "live": "Live",
  "install-pending": "Pending",
  "paused": "Paused",
};

const TYPE_LABEL: Record<string, string> = {
  "cocktail-bar": "Cocktail Bar", "hotel": "Hotel", "nightclub": "Nightclub",
  "bar-restaurant": "Bar & Restaurant", "restaurant": "Restaurant",
  "food-hall": "Food Hall", "arcade-bar": "Arcade Bar",
};

function getPerformanceColour(rev: number, max: number): string {
  if (max === 0) return "#94a3b8";
  const pct = rev / max;
  if (pct > 0.7) return "#4ade80";
  if (pct > 0.35) return "#facc15";
  return "#f87171";
}

const fmt = (v: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(v);

const PRIORITY_COLOUR: Record<ExpansionTarget["priority"], string> = {
  high:   "rgba(74,222,128,0.18)",
  medium: "rgba(250,204,21,0.18)",
  low:    "rgba(148,163,184,0.15)",
};
const PRIORITY_BORDER: Record<ExpansionTarget["priority"], string> = {
  high:   "#4ade80",
  medium: "#facc15",
  low:    "#94a3b8",
};

export default function MapClient({ venues, colourMode, expansionTargets = [] }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selectedExpansion, setSelectedExpansion] = useState<string | null>(null);
  const leafletRef = useRef<{ map: L.Map; markers: Map<string, L.CircleMarker> } | null>(null);

  const maxRevenue = Math.max(...venues.map((v) => v.revenueGbp));

  const getColour = (v: VenueWithMachines) =>
    colourMode === "status"
      ? STATUS_COLOUR[v.status]
      : getPerformanceColour(v.revenueGbp, maxRevenue);

  useEffect(() => {
    if (!mapRef.current) return;
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current) return;
      // avoid double-init in React StrictMode
      if (leafletRef.current) {
        leafletRef.current.map.remove();
        leafletRef.current = null;
      }

      const map = L.default.map(mapRef.current).setView([53.479, -2.245], 13);

      L.default.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const markers = new Map<string, L.CircleMarker>();

      venues.forEach((v) => {
        const colour = getColour(v);
        const marker = L.default
          .circleMarker([v.lat, v.lng], {
            radius: 9,
            fillColor: colour,
            color: "#14110F",
            weight: 1.5,
            fillOpacity: 0.9,
          })
          .addTo(map)
          .on("click", () => setSelected((prev) => (prev === v.id ? null : v.id)));
        markers.set(v.id, marker);
      });

      // Expansion target circles
      expansionTargets.forEach((target) => {
        const circle = L.default.circle([target.lat, target.lng], {
          radius: target.radiusM,
          fillColor: PRIORITY_COLOUR[target.priority],
          color: PRIORITY_BORDER[target.priority],
          weight: 1.5,
          fillOpacity: 1,
          dashArray: "5,5",
        }).addTo(map);

        const label = L.default.marker([target.lat, target.lng], {
          icon: L.default.divIcon({
            className: "",
            html: `<div style="background:rgba(255,255,255,0.9);border:1.5px solid ${PRIORITY_BORDER[target.priority]};border-radius:4px;padding:2px 6px;font-family:sans-serif;font-size:10px;font-weight:600;white-space:nowrap;color:#14110F;">${target.name}</div>`,
            iconAnchor: [0, 0],
          }),
        }).addTo(map);

        circle.on("click", () => setSelectedExpansion((prev) => (prev === target.id ? null : target.id)));
        label.on("click", () => setSelectedExpansion((prev) => (prev === target.id ? null : target.id)));
      });

      leafletRef.current = { map, markers };
    });

    return () => {
      cancelled = true;
      if (leafletRef.current) {
        leafletRef.current.map.remove();
        leafletRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colourMode]);

  // Highlight hovered marker
  useEffect(() => {
    if (!leafletRef.current) return;
    import("leaflet").then((L) => {
      leafletRef.current?.markers.forEach((marker, id) => {
        marker.setStyle({ weight: id === hovered ? 3 : 1.5, color: id === hovered ? "#C9A684" : "#14110F" });
      });
    });
  }, [hovered]);

  const selectedVenue = venues.find((v) => v.id === selected);
  const selectedTarget = expansionTargets.find((t) => t.id === selectedExpansion);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[600px]">
      {/* Map */}
      <div className="flex-1 relative rounded-xl overflow-hidden border border-stone/10">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <div ref={mapRef} className="w-full h-full" />

        {/* Selected expansion target popover */}
        {selectedTarget && !selectedVenue && (
          <div className="absolute bottom-4 left-4 right-4 lg:right-auto lg:w-72 bg-white rounded-xl border border-stone/15 shadow-lg p-4 z-[1000]">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-sans text-sm font-semibold text-ink">{selectedTarget.name}</p>
                <p className="font-sans text-xs text-stone">Expansion target · {selectedTarget.radiusM}m radius</p>
              </div>
              <span className={`shrink-0 px-2 py-0.5 rounded-full font-sans text-[10px] font-semibold`}
                style={{ background: PRIORITY_COLOUR[selectedTarget.priority], border: `1px solid ${PRIORITY_BORDER[selectedTarget.priority]}`, color: "#14110F" }}>
                {selectedTarget.priority} priority
              </span>
            </div>
            <p className="font-sans text-xs text-stone leading-relaxed">{selectedTarget.description}</p>
            <p className="font-sans text-[10px] text-stone/50 mt-2 italic">Planning aid only — no venue data attached.</p>
            <button onClick={() => setSelectedExpansion(null)} className="mt-2 font-sans text-xs text-accent hover:underline">Dismiss</button>
          </div>
        )}

        {/* Selected venue popover */}
        {selectedVenue && (
          <div className="absolute bottom-4 left-4 right-4 lg:right-auto lg:w-72 bg-white rounded-xl border border-stone/15 shadow-lg p-4 z-[1000]">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-sans text-sm font-semibold text-ink">{selectedVenue.name}</p>
                <p className="font-sans text-xs text-stone">{selectedVenue.area} · {TYPE_LABEL[selectedVenue.type] ?? selectedVenue.type}</p>
              </div>
              <span className={`shrink-0 inline-block px-2 py-0.5 rounded-full font-sans text-[10px] font-semibold`}
                style={{ background: STATUS_COLOUR[selectedVenue.status] + "30", color: "#14110F" }}>
                {STATUS_LABEL[selectedVenue.status]}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div>
                <p className="text-stone">Revenue (period)</p>
                <p className="font-semibold text-ink">{fmt(selectedVenue.revenueGbp)}</p>
              </div>
              <div>
                <p className="text-stone">Machines</p>
                <p className="font-semibold text-ink">{selectedVenue.machines.length}</p>
              </div>
            </div>
            <div className="flex gap-2 text-xs mb-3">
              {selectedVenue.machines.map((m) => (
                <span key={m.id} className={`px-2 py-0.5 rounded-full font-sans text-[10px] ${
                  m.status === "online" ? "bg-green-50 text-green-700" :
                  m.status === "fault" ? "bg-red-50 text-red-600" :
                  "bg-stone/10 text-stone"
                }`}>
                  {m.id} · {m.status}
                </span>
              ))}
            </div>
            <Link href={`/console/venues/${selectedVenue.id}`}
              className="block text-center font-sans text-xs font-semibold text-accent hover:text-ink transition-colors">
              View venue →
            </Link>
          </div>
        )}
      </div>

      {/* Venue list */}
      <div className="lg:w-64 overflow-y-auto bg-white border border-stone/10 rounded-xl">
        <div className="sticky top-0 bg-white border-b border-stone/10 px-3 py-2.5">
          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-stone">
            {venues.length} venues
          </p>
        </div>
        <ul>
          {venues.map((v) => (
            <li key={v.id}>
              <button
                onMouseEnter={() => setHovered(v.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => {
                  setSelected((prev) => (prev === v.id ? null : v.id));
                  leafletRef.current?.map.setView([v.lat, v.lng], 15, { animate: true });
                }}
                className={`w-full text-left px-3 py-2.5 border-b border-stone/5 flex items-start gap-2.5 transition-colors ${
                  selected === v.id ? "bg-accent/8" : "hover:bg-stone/5"
                }`}
              >
                <span
                  className="mt-1 shrink-0 w-2 h-2 rounded-full"
                  style={{ background: getColour(v) }}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="font-sans text-xs font-semibold text-ink leading-tight truncate">{v.name}</p>
                  <p className="font-sans text-[10px] text-stone">{v.area}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
