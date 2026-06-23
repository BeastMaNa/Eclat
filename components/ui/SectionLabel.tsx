import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "font-sans text-xs font-medium tracking-[0.18em] uppercase text-accent mb-4",
        className
      )}
    >
      {children}
    </p>
  );
}
