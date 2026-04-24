import React from 'react';
import { CATEGORY_MAP, type CategoryKey } from '@/components/CategoryHero';

interface CategoryCardCoverProps {
  category: CategoryKey;
  title: string;
  className?: string;
}

/**
 * Card-sized version of CategoryHero, used as the cover image on article
 * listing cards (e.g., Information page). Mirrors the in-article hero so
 * each blog has a consistent branded "cover".
 */
const CategoryCardCover: React.FC<CategoryCardCoverProps> = ({ category, title, className }) => {
  const cfg = CATEGORY_MAP[category] ?? CATEGORY_MAP.all;
  const Icon = cfg.icon;

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className ?? ''}`}
      style={{ background: cfg.gradient }}
    >
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: cfg.pattern }}
        aria-hidden="true"
      />
      {/* Floating accents */}
      <div
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: cfg.accent }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-16 -left-12 w-44 h-44 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: cfg.accent }}
        aria-hidden="true"
      />

      <div className="relative z-10 h-full w-full p-5 flex flex-col justify-between text-primary-foreground">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/25">
            <Icon className="w-4 h-4" strokeWidth={2.2} />
          </div>
          <span className="uppercase tracking-[0.18em] text-[10px] font-semibold opacity-90">
            {cfg.label}
          </span>
        </div>

        <h3 className="text-lg md:text-xl font-bold leading-snug line-clamp-3 drop-shadow-sm">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default CategoryCardCover;
