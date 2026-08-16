import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span className="bg-gradient-spark grid size-9 place-items-center rounded-xl text-primary-foreground shadow-lift transition-transform group-hover:scale-105">
        <Sparkles className="size-5" strokeWidth={2.4} />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-lg font-bold tracking-tight">StudySpark</span>
        {!compact && (
          <span className="block text-[11px] text-muted-foreground">
            Find What Matters. Learn What Matters.
          </span>
        )}
      </span>
    </Link>
  );
}
