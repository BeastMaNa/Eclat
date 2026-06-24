"use client";

import dynamic from "next/dynamic";
import type { Venue, AdminMachine } from "@/lib/admin/types";

interface VenueWithMachines extends Venue {
  machines: AdminMachine[];
  revenueGbp: number;
}

const MapClient = dynamic(() => import("./MapClient"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] bg-stone/10 rounded-xl animate-pulse flex items-center justify-center">
      <p className="font-sans text-sm text-stone">Loading map…</p>
    </div>
  ),
});

export function MapWrapper({ venues, colourMode }: { venues: VenueWithMachines[]; colourMode: "status" | "performance" }) {
  return <MapClient venues={venues} colourMode={colourMode} />;
}
