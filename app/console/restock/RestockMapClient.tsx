"use client";

import { useEffect, useRef } from "react";

export interface RouteStop {
  venueId: string;
  venueName: string;
  area: string;
  lat: number;
  lng: number;
  totalBottles: number;
  step: number;
}

export function RestockMapClient({ stops }: { stops: RouteStop[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || stops.length === 0) return;
    let map: L.Map;

    (async () => {
      const L = (await import("leaflet")).default;

      // Inject Leaflet CSS once
      if (!document.querySelector("#leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (!containerRef.current) return;
      map = L.map(containerRef.current, { zoomControl: true }).setView(
        [53.479, -2.245],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      // Draw route polyline
      const latlngs = stops.map((s) => [s.lat, s.lng] as [number, number]);
      L.polyline(latlngs, { color: "#C9A684", weight: 2, dashArray: "6 4" }).addTo(map);

      // Numbered markers
      stops.forEach((stop) => {
        const icon = L.divIcon({
          html: `<div style="background:#14110F;color:#F5F0EA;border:2px solid #C9A684;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:sans-serif;">${stop.step}</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
          className: "",
        });

        L.marker([stop.lat, stop.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:sans-serif;font-size:12px;line-height:1.5;">
              <strong style="font-size:13px;">${stop.venueName}</strong><br/>
              ${stop.area}<br/>
              <span style="color:#8B8378;">${stop.totalBottles} bottles to load</span>
            </div>`
          );
      });

      // Fit bounds to stops
      if (stops.length > 1) {
        map.fitBounds(L.latLngBounds(latlngs), { padding: [40, 40] });
      }
    })();

    return () => { map?.remove(); };
  }, [stops]);

  if (stops.length === 0) {
    return (
      <div className="h-[380px] bg-stone/5 rounded-xl flex items-center justify-center">
        <p className="font-sans text-sm text-stone">No venues selected</p>
      </div>
    );
  }

  return <div ref={containerRef} className="h-[380px] rounded-xl overflow-hidden z-0" />;
}
