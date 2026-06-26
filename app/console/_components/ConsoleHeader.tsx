"use client";

import { Suspense } from "react";
import { DateRangePicker } from "./DateRangePicker";

interface ConsoleHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function ConsoleHeader({ title, subtitle, actions }: ConsoleHeaderProps) {
  return (
    <div className="sticky top-12 lg:top-0 z-40 bg-[#F5F3EF]/95 backdrop-blur-sm border-b border-stone/10 px-4 lg:px-6 py-2 flex items-center justify-between gap-3 min-h-[40px]">
      <div className="min-w-0">
        <h1 className="font-serif text-base font-bold text-ink leading-none truncate">{title}</h1>
        {subtitle && (
          <p className="font-sans text-[10px] text-stone mt-0.5 leading-none">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
        {actions}
        <Suspense fallback={<div className="h-7 w-36 rounded-lg bg-stone/10 animate-pulse" aria-hidden="true" />}>
          <DateRangePicker />
        </Suspense>
      </div>
    </div>
  );
}
