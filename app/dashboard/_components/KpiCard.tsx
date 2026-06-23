interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
}

export function KpiCard({ label, value, sub }: KpiCardProps) {
  return (
    <div className="bg-white/60 border border-stone/10 rounded-xl p-5">
      <p className="font-sans text-xs tracking-[0.12em] uppercase text-stone mb-2">
        {label}
      </p>
      <p className="font-serif text-3xl font-bold text-ink leading-none">{value}</p>
      {sub && (
        <p className="mt-1.5 font-sans text-xs text-stone">{sub}</p>
      )}
    </div>
  );
}
