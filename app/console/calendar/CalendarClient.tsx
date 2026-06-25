"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  List,
  LayoutGrid,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalendarEvent, CalendarEventType } from "@/lib/admin/calendar";
import { EVENT_CONFIG, ALL_CALENDAR_TYPES } from "@/lib/admin/calendar";

// ─── Calendar grid utilities ──────────────────────────────────────────────────

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseIsoDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// 42 days (6 rows × 7 cols) for month grid, Mon-first (UK convention)
function getMonthGrid(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const startDow = firstDay.getDay(); // 0=Sun
  const daysBack = startDow === 0 ? 6 : startDow - 1;
  const gridStart = new Date(firstDay);
  gridStart.setDate(gridStart.getDate() - daysBack);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(d.getDate() + i);
    return d;
  });
}

// Mon–Sun for week view
function getWeekDays(date: Date): Date[] {
  const dow = date.getDay();
  const daysBack = dow === 0 ? 6 : dow - 1;
  const weekStart = new Date(date);
  weekStart.setDate(weekStart.getDate() - daysBack);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

function formatWeekRange(date: Date): string {
  const wd = getWeekDays(date);
  const first = wd[0];
  const last = wd[6];
  if (first.getMonth() === last.getMonth()) {
    return `${first.getDate()}–${last.getDate()} ${first.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`;
  }
  return `${first.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${last.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;
}

function formatFullDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const DOW_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  scheduled: "Scheduled",
  done: "Done",
  due: "Due",
  paid: "Paid",
  active: "Active",
  "expiring-soon": "Expiring soon",
  lapsed: "Lapsed",
  pending: "Pending",
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  won: "Won",
  lost: "Lost",
  received: "Received",
  sent: "Sent",
  draft: "Draft",
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "text-red-600",
  high: "text-orange-600",
  medium: "text-amber-600",
  low: "text-stone",
};

// ─── Event chip ───────────────────────────────────────────────────────────────

function EventChip({
  event,
  onClick,
  compact = false,
}: {
  event: CalendarEvent;
  onClick: (e: CalendarEvent, rect: DOMRect) => void;
  compact?: boolean;
}) {
  const cfg = EVENT_CONFIG[event.type];
  return (
    <button
      type="button"
      onClick={(ev) => {
        ev.stopPropagation();
        onClick(event, ev.currentTarget.getBoundingClientRect());
      }}
      className={cn(
        "w-full text-left truncate border rounded px-1.5 leading-tight transition-colors duration-150",
        "hover:brightness-95 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/60",
        cfg.chipClass,
        compact ? "text-[9px] py-[2px]" : "text-[10px] py-0.5",
      )}
      title={event.title}
      aria-label={`${event.title} — ${event.date}`}
    >
      <span className="flex items-center gap-1 min-w-0">
        <span className={cn("shrink-0 w-1.5 h-1.5 rounded-full", cfg.dotClass)} />
        <span className="truncate">{event.title}</span>
      </span>
    </button>
  );
}

// ─── Event popover ────────────────────────────────────────────────────────────

function EventPopover({
  event,
  anchor,
  onClose,
}: {
  event: CalendarEvent;
  anchor: DOMRect;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const cfg = EVENT_CONFIG[event.type];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [onClose]);

  // Position near the chip, clamped to viewport
  const width = 288;
  const vp = { w: window.innerWidth, h: window.innerHeight };
  const left = Math.max(8, Math.min(anchor.left, vp.w - width - 8));
  const top =
    anchor.bottom + 6 + 220 > vp.h
      ? Math.max(8, anchor.top - 220 - 6) // flip above
      : anchor.bottom + 6;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={event.title}
      style={{ position: "fixed", left, top, width, zIndex: 100 }}
      className="bg-white border border-stone/15 rounded-xl shadow-xl overflow-hidden animate-fade-in"
    >
      {/* Coloured header */}
      <div className={cn("px-4 py-3 flex items-start justify-between gap-2", cfg.chipClass)}>
        <div className="min-w-0">
          <p className="font-sans text-[9px] font-bold uppercase tracking-[0.12em] opacity-60">
            {cfg.label}
            {event.badge && ` · ${event.badge}`}
          </p>
          <p className="font-sans text-sm font-semibold text-ink mt-0.5 leading-snug">
            {event.title}
          </p>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 mt-0.5 text-stone/50 hover:text-ink transition-colors"
          aria-label="Close"
        >
          <X size={13} />
        </button>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-2">
        <p className="font-sans text-xs text-stone">
          {formatFullDate(parseIsoDate(event.date))}
        </p>

        {event.venueName && (
          <p className="font-sans text-xs text-ink">
            <span className="text-stone">Venue: </span>
            {event.venueName}
          </p>
        )}
        {event.assignee && (
          <p className="font-sans text-xs text-ink">
            <span className="text-stone">Assignee: </span>
            {event.assignee}
          </p>
        )}
        {event.status && (
          <p className="font-sans text-xs text-ink">
            <span className="text-stone">Status: </span>
            {STATUS_LABELS[event.status] ?? event.status}
          </p>
        )}
        {event.priority && (
          <p
            className={cn(
              "font-sans text-xs font-semibold capitalize",
              PRIORITY_COLORS[event.priority],
            )}
          >
            {event.priority} priority
          </p>
        )}
        {event.description && (
          <p className="font-sans text-[11px] text-stone leading-relaxed">
            {event.description}
          </p>
        )}

        <Link
          href={event.href}
          className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-accent hover:text-[#B58A66] transition-colors mt-1"
        >
          {cfg.cta}
          <ExternalLink size={10} />
        </Link>
      </div>
    </div>
  );
}

// ─── Filter bar ───────────────────────────────────────────────────────────────

function FilterBar({
  activeTypes,
  venues,
  activeVenue,
  activeStatus,
  onToggleType,
  onVenueChange,
  onStatusChange,
  onClearAll,
}: {
  activeTypes: CalendarEventType[];
  venues: { id: string; name: string }[];
  activeVenue: string;
  activeStatus: string;
  onToggleType: (t: CalendarEventType) => void;
  onVenueChange: (v: string) => void;
  onStatusChange: (s: string) => void;
  onClearAll: () => void;
}) {
  const hasFilters =
    activeTypes.length < ALL_CALENDAR_TYPES.length ||
    activeVenue !== "" ||
    activeStatus !== "";

  return (
    <div
      className="flex items-center gap-2 flex-wrap"
      role="group"
      aria-label="Calendar filters"
    >
      {ALL_CALENDAR_TYPES.map((t) => {
        const cfg = EVENT_CONFIG[t];
        const active = activeTypes.includes(t);
        return (
          <button
            key={t}
            onClick={() => onToggleType(t)}
            aria-pressed={active}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-sans text-[10px] font-semibold border transition-all duration-150",
              active
                ? cfg.chipClass
                : "bg-stone/5 text-stone/50 border-stone/15 hover:text-stone hover:border-stone/25",
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors",
                active ? cfg.dotClass : "bg-stone/30",
              )}
            />
            {cfg.label}
          </button>
        );
      })}

      <select
        value={activeVenue}
        onChange={(e) => onVenueChange(e.target.value)}
        aria-label="Filter by venue"
        className="font-sans text-[10px] border border-stone/15 rounded-full px-3 py-1 text-stone focus:outline-none focus:border-accent/40 bg-white hover:border-stone/30 transition-colors cursor-pointer"
      >
        <option value="">All venues</option>
        {venues.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>

      <select
        value={activeStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        aria-label="Filter by status"
        className="font-sans text-[10px] border border-stone/15 rounded-full px-3 py-1 text-stone focus:outline-none focus:border-accent/40 bg-white hover:border-stone/30 transition-colors cursor-pointer"
      >
        <option value="">All statuses</option>
        <optgroup label="Maintenance">
          <option value="open">Open</option>
          <option value="scheduled">Scheduled</option>
          <option value="done">Done</option>
        </optgroup>
        <optgroup label="Inquiry">
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </optgroup>
        <optgroup label="Payout">
          <option value="due">Due</option>
          <option value="paid">Paid</option>
        </optgroup>
        <optgroup label="Contract">
          <option value="active">Active</option>
          <option value="expiring-soon">Expiring soon</option>
          <option value="lapsed">Lapsed</option>
        </optgroup>
      </select>

      {hasFilters && (
        <button
          onClick={onClearAll}
          className="font-sans text-[10px] text-stone hover:text-ink transition-colors px-2 py-1 rounded-full hover:bg-stone/5"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

// ─── Month view ───────────────────────────────────────────────────────────────

const MAX_VISIBLE_PER_DAY = 3;

function MonthView({
  currentDate,
  events,
  today,
  onEventClick,
}: {
  currentDate: Date;
  events: CalendarEvent[];
  today: Date;
  onEventClick: (e: CalendarEvent, rect: DOMRect) => void;
}) {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const days = getMonthGrid(currentDate.getFullYear(), currentDate.getMonth());

  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const evt of events) {
    const list = eventsByDate.get(evt.date) ?? [];
    list.push(evt);
    eventsByDate.set(evt.date, list);
  }

  const totalRows = 6;
  const emptyMonthRows = Math.floor(totalRows / 7);
  const hasAnyEvents = events.length > 0;

  return (
    <div role="grid" aria-label={`Month of ${formatMonthYear(currentDate)}`}>
      {/* Day-of-week header */}
      <div className="grid grid-cols-7 border-b border-stone/10" role="row">
        {DOW_LABELS.map((d, i) => (
          <div
            key={d}
            role="columnheader"
            aria-label={["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][i]}
            className="px-2 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-stone text-center"
          >
            {d}
          </div>
        ))}
      </div>

      {!hasAnyEvents && (
        <div className="py-16 text-center">
          <CalendarDays size={28} className="text-stone/20 mx-auto mb-3" />
          <p className="font-sans text-sm text-stone">Nothing scheduled this month</p>
          <p className="font-sans text-[11px] text-stone/50 mt-1">
            Try adjusting the filters or navigating to a different period
          </p>
        </div>
      )}

      {hasAnyEvents && (
        <div className="grid grid-cols-7" role="rowgroup">
          {days.map((day, i) => {
            const ds = isoDate(day);
            const isToday = sameDay(day, today);
            const isCurrMonth = day.getMonth() === currentDate.getMonth();
            const dayEvents = eventsByDate.get(ds) ?? [];
            const isExpanded = expandedDay === ds;
            const visible = isExpanded
              ? dayEvents
              : dayEvents.slice(0, MAX_VISIBLE_PER_DAY);
            const overflow = dayEvents.length - MAX_VISIBLE_PER_DAY;
            const isLastRow = Math.floor(i / 7) === Math.floor((days.length - 1) / 7);

            return (
              <div
                key={ds}
                role="gridcell"
                aria-label={`${formatFullDate(day)}${dayEvents.length > 0 ? `, ${dayEvents.length} event${dayEvents.length > 1 ? "s" : ""}` : ""}`}
                className={cn(
                  "min-h-[88px] p-1.5 border-b border-r border-stone/8 focus-within:bg-stone/[0.015]",
                  i % 7 === 6 && "border-r-0",
                  isLastRow && "border-b-0",
                  !isCurrMonth && "bg-stone/[0.018]",
                )}
              >
                <div className="mb-1">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-6 h-6 rounded-full font-sans text-[11px]",
                      isToday
                        ? "bg-ink text-bone font-semibold"
                        : isCurrMonth
                          ? "text-ink font-medium"
                          : "text-stone/35",
                    )}
                  >
                    {day.getDate()}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {visible.map((evt) => (
                    <EventChip
                      key={evt.id}
                      event={evt}
                      onClick={onEventClick}
                      compact
                    />
                  ))}
                  {!isExpanded && overflow > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedDay(ds);
                      }}
                      className="w-full text-left font-sans text-[9px] text-stone/60 hover:text-accent transition-colors px-1.5 py-0.5"
                    >
                      +{overflow} more
                    </button>
                  )}
                  {isExpanded && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedDay(null);
                      }}
                      className="w-full text-left font-sans text-[9px] text-stone/60 hover:text-accent transition-colors px-1.5 py-0.5"
                    >
                      Show less
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Week view ────────────────────────────────────────────────────────────────

function WeekView({
  currentDate,
  events,
  today,
  onEventClick,
}: {
  currentDate: Date;
  events: CalendarEvent[];
  today: Date;
  onEventClick: (e: CalendarEvent, rect: DOMRect) => void;
}) {
  const weekDays = getWeekDays(currentDate);

  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const evt of events) {
    const list = eventsByDate.get(evt.date) ?? [];
    list.push(evt);
    eventsByDate.set(evt.date, list);
  }

  const hasAnyEvents = events.length > 0;
  const weekEventsTotal = weekDays.reduce(
    (sum, d) => sum + (eventsByDate.get(isoDate(d))?.length ?? 0),
    0,
  );

  return (
    <div>
      <div className="grid grid-cols-7">
        {weekDays.map((day, i) => {
          const ds = isoDate(day);
          const isToday = sameDay(day, today);
          const dayEvents = eventsByDate.get(ds) ?? [];

          return (
            <div
              key={ds}
              className={cn("border-r border-stone/10", i === 6 && "border-r-0")}
            >
              {/* Day header */}
              <div
                className={cn(
                  "px-2 py-2.5 text-center border-b border-stone/10",
                  isToday && "bg-stone/[0.025]",
                )}
              >
                <p className="font-sans text-[9px] font-bold uppercase tracking-[0.12em] text-stone">
                  {DOW_LABELS[i]}
                </p>
                <span
                  className={cn(
                    "inline-flex items-center justify-center w-7 h-7 mt-0.5 rounded-full font-sans text-sm mx-auto",
                    isToday
                      ? "bg-ink text-bone font-semibold"
                      : "text-ink font-medium",
                  )}
                >
                  {day.getDate()}
                </span>
                <p className="font-sans text-[9px] text-stone/50 mt-0.5">
                  {day.toLocaleDateString("en-GB", { month: "short" })}
                </p>
              </div>

              {/* Events */}
              <div className="p-1.5 space-y-0.5 min-h-[180px]">
                {dayEvents.map((evt) => (
                  <EventChip key={evt.id} event={evt} onClick={onEventClick} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {weekEventsTotal === 0 && (
        <div className="py-12 text-center border-t border-stone/8">
          <p className="font-sans text-sm text-stone">Nothing scheduled this week</p>
          <p className="font-sans text-[11px] text-stone/50 mt-1">
            Try adjusting the filters or navigating to a different week
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Agenda / List view ───────────────────────────────────────────────────────

function ListView({
  events,
  onEventClick,
}: {
  events: CalendarEvent[];
  onEventClick: (e: CalendarEvent, rect: DOMRect) => void;
}) {
  const todayStr = isoDate(new Date());
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));

  // Group by date
  const grouped = new Map<string, CalendarEvent[]>();
  for (const evt of sorted) {
    const g = grouped.get(evt.date) ?? [];
    g.push(evt);
    grouped.set(evt.date, g);
  }

  if (grouped.size === 0) {
    return (
      <div className="py-16 text-center">
        <List size={28} className="text-stone/20 mx-auto mb-3" />
        <p className="font-sans text-sm text-stone">No events match the current filters</p>
        <p className="font-sans text-[11px] text-stone/50 mt-1">
          Toggle event types or clear filters to see more
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-stone/8">
      {Array.from(grouped.entries()).map(([date, evts]) => {
        const d = parseIsoDate(date);
        const isToday = date === todayStr;
        const isPast = date < todayStr;

        return (
          <div key={date} className="flex gap-0 sm:gap-4">
            {/* Date column */}
            <div className="w-24 sm:w-32 shrink-0 px-4 py-4 border-r border-stone/8">
              <p
                className={cn(
                  "font-sans text-xs font-semibold",
                  isToday
                    ? "text-accent"
                    : isPast
                      ? "text-stone/50"
                      : "text-ink",
                )}
              >
                {isToday
                  ? "Today"
                  : d.toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
              </p>
              <p className="font-sans text-[10px] text-stone/50 mt-0.5">
                {d.getFullYear()}
              </p>
            </div>

            {/* Events column */}
            <div className="flex-1 min-w-0 px-4 py-3 space-y-2.5">
              {evts.map((evt) => {
                const cfg = EVENT_CONFIG[evt.type];
                return (
                  <div key={evt.id} className="flex items-start gap-3">
                    <span
                      className={cn(
                        "shrink-0 w-2 h-2 rounded-full mt-1.5",
                        cfg.dotClass,
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={(e) =>
                          onEventClick(evt, e.currentTarget.getBoundingClientRect())
                        }
                        className="text-left group w-full"
                      >
                        <p className="font-sans text-xs font-semibold text-ink group-hover:text-accent transition-colors truncate">
                          {evt.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded border font-sans text-[9px]",
                              cfg.chipClass,
                            )}
                          >
                            {cfg.label}
                          </span>
                          {evt.venueName && (
                            <span className="font-sans text-[10px] text-stone truncate">
                              {evt.venueName}
                            </span>
                          )}
                          {evt.status && (
                            <span className="font-sans text-[10px] text-stone/60 capitalize">
                              {(STATUS_LABELS[evt.status] ?? evt.status).replace(
                                "-",
                                " ",
                              )}
                            </span>
                          )}
                          {evt.priority &&
                            (evt.priority === "urgent" || evt.priority === "high") && (
                              <span
                                className={cn(
                                  "font-sans text-[9px] font-semibold capitalize",
                                  PRIORITY_COLORS[evt.priority],
                                )}
                              >
                                {evt.priority}
                              </span>
                            )}
                        </div>
                      </button>
                    </div>
                    <Link
                      href={evt.href}
                      className="shrink-0 font-sans text-[10px] text-stone/50 hover:text-accent transition-colors whitespace-nowrap"
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      Open →
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex items-center gap-4 flex-wrap" aria-label="Event type legend">
      <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-stone/40">
        Legend
      </span>
      {ALL_CALENDAR_TYPES.map((t) => {
        const cfg = EVENT_CONFIG[t];
        return (
          <div key={t} className="flex items-center gap-1.5">
            <span className={cn("w-2 h-2 rounded-full", cfg.dotClass)} />
            <span className="font-sans text-[10px] text-stone">{cfg.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main CalendarClient ──────────────────────────────────────────────────────

export interface CalendarClientProps {
  events: CalendarEvent[];
  venues: { id: string; name: string }[];
  initialView: "month" | "week" | "agenda";
  initialDate: string;
  initialTypes: CalendarEventType[];
  initialVenue: string;
  initialStatus: string;
}

export function CalendarClient({
  events,
  venues,
  initialView,
  initialDate,
  initialTypes,
  initialVenue,
  initialStatus,
}: CalendarClientProps) {
  const [view, setView] = useState<"month" | "week" | "agenda">(initialView);
  const [currentDate, setCurrentDate] = useState(() => parseIsoDate(initialDate));
  const [activeTypes, setActiveTypes] =
    useState<CalendarEventType[]>(initialTypes);
  const [venueFilter, setVenueFilter] = useState(initialVenue);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [popoverRect, setPopoverRect] = useState<DOMRect | null>(null);

  const today = new Date();

  // Sync state → URL without triggering Next.js navigation (no server re-render)
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("view", view);
    params.set("date", isoDate(currentDate));
    if (activeTypes.length < ALL_CALENDAR_TYPES.length) {
      params.set("types", activeTypes.join(","));
    }
    if (venueFilter) params.set("venue", venueFilter);
    if (statusFilter) params.set("status", statusFilter);
    window.history.replaceState(null, "", "?" + params.toString());
  }, [view, currentDate, activeTypes, venueFilter, statusFilter]);

  // Filter events client-side
  const filteredEvents = events.filter((evt) => {
    if (!activeTypes.includes(evt.type)) return false;
    if (venueFilter && evt.venueId !== venueFilter) return false;
    if (statusFilter && evt.status !== statusFilter) return false;
    return true;
  });

  function navigate(dir: 1 | -1) {
    setCurrentDate((d) => {
      const next = new Date(d);
      if (view === "month") {
        next.setDate(1); // avoid Feb 30 etc.
        next.setMonth(next.getMonth() + dir);
      } else {
        next.setDate(next.getDate() + dir * 7);
      }
      return next;
    });
  }

  function handleEventClick(evt: CalendarEvent, rect: DOMRect) {
    setSelectedEvent(evt);
    setPopoverRect(rect);
  }

  function handleToggleType(t: CalendarEventType) {
    setActiveTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }

  function handleClearAll() {
    setActiveTypes(ALL_CALENDAR_TYPES);
    setVenueFilter("");
    setStatusFilter("");
  }

  const navLabel =
    view === "month"
      ? formatMonthYear(currentDate)
      : view === "week"
        ? formatWeekRange(currentDate)
        : "All events";

  const showNav = view !== "agenda";

  const viewButtons: { key: "month" | "week" | "agenda"; label: string; Icon: React.ElementType }[] = [
    { key: "month", label: "Month", Icon: LayoutGrid },
    { key: "week", label: "Week", Icon: CalendarDays },
    { key: "agenda", label: "Agenda", Icon: List },
  ];

  return (
    <div className="space-y-4">
      {/* ── Top bar: navigation + view switcher ── */}
      <div className="flex items-center gap-3 flex-wrap">
        {showNav && (
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => navigate(-1)}
              aria-label={view === "month" ? "Previous month" : "Previous week"}
              className="p-1.5 rounded-lg text-stone hover:text-ink hover:bg-stone/5 transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="font-sans text-sm font-semibold text-ink min-w-[188px] text-center select-none">
              {navLabel}
            </span>
            <button
              onClick={() => navigate(1)}
              aria-label={view === "month" ? "Next month" : "Next week"}
              className="p-1.5 rounded-lg text-stone hover:text-ink hover:bg-stone/5 transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        )}

        {!showNav && (
          <span className="font-sans text-sm font-semibold text-ink">
            {navLabel}
          </span>
        )}

        <button
          onClick={() => setCurrentDate(new Date())}
          className="px-3 py-1.5 rounded-full font-sans text-xs font-semibold border border-stone/20 text-stone hover:text-ink hover:border-stone/35 transition-colors"
        >
          Today
        </button>

        <div className="flex-1" />

        {/* Event count badge */}
        <span className="font-sans text-[10px] text-stone/60">
          {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
        </span>

        {/* View switcher */}
        <div
          className="flex items-center gap-0.5 p-0.5 rounded-lg border border-stone/15 bg-stone/[0.03]"
          role="group"
          aria-label="Calendar view"
        >
          {viewButtons.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              aria-pressed={view === key}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-sans text-xs font-medium transition-all duration-150",
                view === key
                  ? "bg-white text-ink shadow-sm border border-stone/8"
                  : "text-stone hover:text-ink",
              )}
            >
              <Icon size={12} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Filter bar ── */}
      <FilterBar
        activeTypes={activeTypes}
        venues={venues}
        activeVenue={venueFilter}
        activeStatus={statusFilter}
        onToggleType={handleToggleType}
        onVenueChange={setVenueFilter}
        onStatusChange={setStatusFilter}
        onClearAll={handleClearAll}
      />

      {/* ── Calendar body ── */}
      <div className="bg-white border border-stone/10 rounded-xl overflow-hidden">
        {view === "month" && (
          <MonthView
            currentDate={currentDate}
            events={filteredEvents}
            today={today}
            onEventClick={handleEventClick}
          />
        )}
        {view === "week" && (
          <WeekView
            currentDate={currentDate}
            events={filteredEvents}
            today={today}
            onEventClick={handleEventClick}
          />
        )}
        {view === "agenda" && (
          <ListView events={filteredEvents} onEventClick={handleEventClick} />
        )}
      </div>

      {/* ── Legend ── */}
      <Legend />

      {/* ── Event detail popover ── */}
      {selectedEvent && popoverRect && (
        <EventPopover
          event={selectedEvent}
          anchor={popoverRect}
          onClose={() => {
            setSelectedEvent(null);
            setPopoverRect(null);
          }}
        />
      )}
    </div>
  );
}
