"use client";

import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import type { Toast } from "./useToast";

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const STYLES = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  info: "bg-stone/5 border-stone/20 text-ink",
};

interface Props {
  toasts: Toast[];
  onRemove: (id: number) => void;
}

export function ToastList({ toasts, onRemove }: Props) {
  if (!toasts.length) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-4 right-4 z-[400] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((t) => {
        const Icon = ICONS[t.type];
        return (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg font-sans text-xs font-medium max-w-xs animate-in slide-in-from-right-4 ${STYLES[t.type]}`}
          >
            <Icon size={14} className="shrink-0" aria-hidden="true" />
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => onRemove(t.id)}
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Dismiss"
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
