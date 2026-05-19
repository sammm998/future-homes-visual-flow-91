import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

interface LiveViewersProps {
  propertyId: string;
  compact?: boolean;
}

// Deterministic pseudo-random based on id + current hour bucket,
// gently drifts ±1 every ~8 seconds for a "live" feel.
function seedFrom(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function baseFor(propertyId: string): number {
  const hour = Math.floor(Date.now() / (1000 * 60 * 30)); // 30 min bucket
  const seed = seedFrom(`${propertyId}:${hour}`);
  // 3 - 27 viewers range, biased lower
  return 3 + (seed % 25);
}

export default function LiveViewers({ propertyId }: LiveViewersProps) {
  const [count, setCount] = useState(() => baseFor(propertyId));

  useEffect(() => {
    setCount(baseFor(propertyId));
    const tick = setInterval(() => {
      setCount((prev) => {
        const target = baseFor(propertyId);
        const drift = Math.random() < 0.5 ? -1 : 1;
        const next = prev + drift;
        // Stay within ±3 of target, never below 2
        if (next < Math.max(2, target - 3)) return prev + 1;
        if (next > target + 3) return prev - 1;
        return next;
      });
    }, 7000 + Math.random() * 4000);
    return () => clearInterval(tick);
  }, [propertyId]);

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 px-3 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <Eye className="h-3.5 w-3.5" />
      <span>
        <strong className="tabular-nums">{count}</strong> {count === 1 ? "person is" : "people are"} viewing this right now
      </span>
    </div>
  );
}
