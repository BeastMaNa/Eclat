"use client";

import dynamic from "next/dynamic";
import type { RouteStop } from "./RestockMapClient";

const RestockMapClient = dynamic(() => import("./RestockMapClient").then((m) => m.RestockMapClient), {
  ssr: false,
  loading: () => (
    <div className="h-[380px] bg-stone/10 rounded-xl animate-pulse flex items-center justify-center">
      <p className="font-sans text-sm text-stone">Loading map…</p>
    </div>
  ),
});

export function RestockMapWrapper({ stops }: { stops: RouteStop[] }) {
  return <RestockMapClient stops={stops} />;
}
