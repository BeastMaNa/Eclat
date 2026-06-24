"use client";

import { useEffect, useRef } from "react";
import { Archive, Trash2 } from "lucide-react";

interface Props {
  mode: "archive" | "delete" | "restore";
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
}

const CONFIG = {
  archive: {
    icon: Archive,
    iconCls: "text-amber-600",
    bgCls: "bg-amber-50",
    confirmLabel: "Archive",
    confirmCls: "bg-amber-600 hover:bg-amber-700 text-white",
  },
  delete: {
    icon: Trash2,
    iconCls: "text-red-600",
    bgCls: "bg-red-50",
    confirmLabel: "Delete",
    confirmCls: "bg-red-600 hover:bg-red-700 text-white",
  },
  restore: {
    icon: Archive,
    iconCls: "text-green-700",
    bgCls: "bg-green-50",
    confirmLabel: "Restore",
    confirmCls: "bg-green-700 hover:bg-green-800 text-white",
  },
};

export function ConfirmDialog({ mode, title, description, onConfirm, onCancel, isPending }: Props) {
  const cfg = CONFIG[mode];
  const Icon = cfg.icon;
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { e.preventDefault(); onCancel(); }
    }
    document.addEventListener("keydown", onKey);
    const saved = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = saved; };
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" role="presentation">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onCancel} aria-hidden="true" />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby={description ? "confirm-desc" : undefined}
        className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className={`px-5 py-5 ${cfg.bgCls}`}>
          <div className="flex items-start gap-3">
            <Icon size={20} className={`${cfg.iconCls} shrink-0 mt-0.5`} aria-hidden="true" />
            <div>
              <p id="confirm-title" className="font-sans text-sm font-semibold text-ink">{title}</p>
              {description && (
                <p id="confirm-desc" className="font-sans text-xs text-stone mt-1 leading-relaxed">{description}</p>
              )}
            </div>
          </div>
        </div>
        <div className="px-5 py-4 flex items-center justify-end gap-2">
          <button
            ref={cancelRef}
            onClick={onCancel}
            disabled={isPending}
            className="px-4 py-2 rounded-lg border border-stone/20 font-sans text-xs font-semibold text-stone hover:text-ink transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={`px-4 py-2 rounded-lg font-sans text-xs font-semibold transition-colors disabled:opacity-40 ${cfg.confirmCls}`}
          >
            {isPending ? "…" : cfg.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
