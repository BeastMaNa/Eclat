import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getDataSource } from "@/lib/dashboard";
import type { StockItem, Machine } from "@/lib/dashboard";
import { FRAGRANCES as CATALOG } from "@/content/catalog";
import Image from "next/image";

const CATALOG_MAP = Object.fromEntries(
  CATALOG.map((f) => [`${f.house} ${f.name}`, f])
);

function CapacityBar({ item }: { item: StockItem }) {
  const pct = Math.round((item.quantity / item.capacity) * 100);
  const isLow = item.quantity <= item.lowStockThreshold;
  const isEmpty = item.quantity === 0;
  const catalogEntry = CATALOG_MAP[item.fragrance];

  return (
    <div
      className={`bg-white/70 border rounded-xl p-3 ${
        isEmpty
          ? "border-red-300 bg-red-50/50"
          : isLow
          ? "border-amber-300 bg-amber-50/50"
          : "border-stone/10"
      }`}
    >
      {/* Bottle image */}
      {catalogEntry?.image && (
        <div className="relative w-full aspect-square mb-2 bg-white rounded-lg overflow-hidden">
          <Image
            src={catalogEntry.image}
            alt={item.fragrance}
            fill
            className="object-contain p-2"
            sizes="200px"
          />
        </div>
      )}
      <div className="flex items-start justify-between gap-1 mb-1.5">
        <div className="min-w-0">
          <p className="font-sans text-[11px] text-stone/60 truncate">{catalogEntry?.house ?? ""}</p>
          <p className="font-sans text-xs text-ink font-medium leading-snug truncate">{catalogEntry?.name ?? item.fragrance}</p>
        </div>
        <span
          className={`font-sans text-xs font-semibold shrink-0 ${
            isEmpty ? "text-red-600" : isLow ? "text-amber-600" : "text-stone"
          }`}
        >
          {item.quantity}/{item.capacity}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full bg-stone/15 overflow-hidden"
        role="progressbar"
        aria-valuenow={item.quantity}
        aria-valuemin={0}
        aria-valuemax={item.capacity}
        aria-label={`${item.fragrance}: ${item.quantity} of ${item.capacity}`}
      >
        <div
          className={`h-full rounded-full transition-all ${
            isEmpty ? "bg-red-400" : isLow ? "bg-amber-400" : "bg-accent"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1.5 font-sans text-xs text-stone">Slot {item.slot}</p>
    </div>
  );
}

function MachineCard({
  machine,
  stock,
}: {
  machine: Machine;
  stock: StockItem[];
}) {
  const lowCount = stock.filter((s) => s.quantity <= s.lowStockThreshold).length;

  return (
    <div className="bg-white/60 border border-stone/10 rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-ink">{machine.locationLabel}</h2>
          <p className="font-sans text-xs text-stone">{machine.model} · {machine.id}</p>
        </div>
        {lowCount > 0 && (
          <span className="font-sans text-xs bg-amber-100 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5 font-semibold">
            {lowCount} low
          </span>
        )}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
        {stock.map((item) => (
          <CapacityBar key={`${item.machineId}-${item.slot}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export default async function StockPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const venueId = session.user.venueId;
  const ds = getDataSource();

  const [machines, stock] = await Promise.all([
    ds.getMachines(venueId),
    ds.getStock(venueId),
  ]);

  const stockByMachine = new Map<string, StockItem[]>();
  for (const item of stock) {
    const arr = stockByMachine.get(item.machineId) ?? [];
    arr.push(item);
    stockByMachine.set(item.machineId, arr);
  }

  const totalLow = stock.filter((s) => s.quantity <= s.lowStockThreshold).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="font-sans text-xs tracking-[0.15em] uppercase text-stone mb-0.5">
            {session.user.venueName}
          </p>
          <h1 className="font-serif text-2xl font-bold text-ink">Stock</h1>
        </div>
        {totalLow > 0 && (
          <span className="font-sans text-sm bg-amber-100 text-amber-700 border border-amber-200 rounded-full px-3 py-1.5 font-semibold">
            {totalLow} slots below threshold
          </span>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-6 flex-wrap">
        {[
          { color: "bg-accent", label: "Adequate" },
          { color: "bg-amber-400", label: "Low stock" },
          { color: "bg-red-400", label: "Empty" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${color}`} aria-hidden="true" />
            <span className="font-sans text-xs text-stone">{label}</span>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {machines.map((machine) => (
          <MachineCard
            key={machine.id}
            machine={machine}
            stock={stockByMachine.get(machine.id) ?? []}
          />
        ))}
      </div>
    </div>
  );
}
