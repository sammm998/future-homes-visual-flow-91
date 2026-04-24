import React from 'react';
import {
  Home,
  Scale,
  DollarSign,
  Users,
  Briefcase,
  Building,
  TreePine,
  MapPin,
  Globe,
  FileText,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';

export type CategoryKey =
  | 'property'
  | 'legal'
  | 'finance'
  | 'living'
  | 'investment'
  | 'dubai'
  | 'turkey'
  | 'cyprus'
  | 'bali'
  | 'all';

interface CategoryConfig {
  label: string;
  icon: LucideIcon;
  /** semantic gradient using HSL design tokens */
  gradient: string;
  /** subtle decorative pattern overlay */
  pattern: string;
  accent: string;
}

// All colors use HSL design tokens defined in index.css. We compose gradients
// inline with hsl(var(--token) / alpha) so light/dark theme both look right.
const CATEGORY_MAP: Record<CategoryKey, CategoryConfig> = {
  property: {
    label: 'Property',
    icon: Home,
    gradient: 'linear-gradient(135deg, hsl(var(--primary) / 0.95) 0%, hsl(var(--primary) / 0.7) 60%, hsl(var(--accent) / 0.6) 100%)',
    pattern: 'radial-gradient(circle at 20% 30%, hsl(var(--primary-foreground) / 0.12) 0%, transparent 40%), radial-gradient(circle at 80% 70%, hsl(var(--primary-foreground) / 0.08) 0%, transparent 50%)',
    accent: 'hsl(var(--primary))',
  },
  legal: {
    label: 'Legal',
    icon: Scale,
    gradient: 'linear-gradient(135deg, hsl(217 91% 25%) 0%, hsl(217 70% 40%) 100%)',
    pattern: 'repeating-linear-gradient(45deg, hsl(0 0% 100% / 0.04) 0px, hsl(0 0% 100% / 0.04) 2px, transparent 2px, transparent 14px)',
    accent: 'hsl(217 91% 35%)',
  },
  finance: {
    label: 'Finance',
    icon: DollarSign,
    gradient: 'linear-gradient(135deg, hsl(160 70% 22%) 0%, hsl(160 50% 35%) 100%)',
    pattern: 'radial-gradient(circle at 15% 50%, hsl(0 0% 100% / 0.08) 0%, transparent 30%), radial-gradient(circle at 85% 30%, hsl(0 0% 100% / 0.06) 0%, transparent 35%)',
    accent: 'hsl(160 70% 30%)',
  },
  living: {
    label: 'Living',
    icon: Users,
    gradient: 'linear-gradient(135deg, hsl(28 85% 45%) 0%, hsl(14 80% 55%) 100%)',
    pattern: 'radial-gradient(ellipse at 30% 80%, hsl(0 0% 100% / 0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 20%, hsl(0 0% 100% / 0.08) 0%, transparent 40%)',
    accent: 'hsl(28 85% 50%)',
  },
  investment: {
    label: 'Investment',
    icon: Briefcase,
    gradient: 'linear-gradient(135deg, hsl(265 60% 30%) 0%, hsl(280 55% 45%) 100%)',
    pattern: 'repeating-linear-gradient(135deg, hsl(0 0% 100% / 0.05) 0px, hsl(0 0% 100% / 0.05) 1px, transparent 1px, transparent 16px)',
    accent: 'hsl(265 60% 40%)',
  },
  dubai: {
    label: 'Dubai',
    icon: Building,
    gradient: 'linear-gradient(135deg, hsl(35 85% 40%) 0%, hsl(45 90% 55%) 100%)',
    pattern: 'radial-gradient(circle at 50% 100%, hsl(0 0% 100% / 0.15) 0%, transparent 60%)',
    accent: 'hsl(35 85% 50%)',
  },
  turkey: {
    label: 'Turkey',
    icon: MapPin,
    gradient: 'linear-gradient(135deg, hsl(0 65% 40%) 0%, hsl(15 75% 50%) 100%)',
    pattern: 'radial-gradient(circle at 80% 50%, hsl(0 0% 100% / 0.1) 0%, transparent 45%)',
    accent: 'hsl(0 65% 45%)',
  },
  cyprus: {
    label: 'Cyprus',
    icon: Globe,
    gradient: 'linear-gradient(135deg, hsl(195 80% 35%) 0%, hsl(180 70% 50%) 100%)',
    pattern: 'radial-gradient(ellipse at 20% 20%, hsl(0 0% 100% / 0.12) 0%, transparent 40%)',
    accent: 'hsl(195 80% 45%)',
  },
  bali: {
    label: 'Bali',
    icon: TreePine,
    gradient: 'linear-gradient(135deg, hsl(140 55% 28%) 0%, hsl(155 50% 42%) 100%)',
    pattern: 'radial-gradient(circle at 70% 80%, hsl(0 0% 100% / 0.1) 0%, transparent 50%)',
    accent: 'hsl(140 55% 38%)',
  },
  all: {
    label: 'Information',
    icon: FileText,
    gradient: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
    pattern: 'radial-gradient(circle at 50% 50%, hsl(var(--primary-foreground) / 0.08) 0%, transparent 60%)',
    accent: 'hsl(var(--primary))',
  },
};

/** Detect category from title + content using same rules as Information.tsx */
export function detectCategory(title: string, content = ''): CategoryKey {
  const text = (title + ' ' + content).toLowerCase();
  if (text.includes('dubai')) return 'dubai';
  if (text.includes('bali')) return 'bali';
  if (text.includes('turkey') || text.includes('antalya') || text.includes('mersin')) return 'turkey';
  if (text.includes('cyprus')) return 'cyprus';
  if (text.includes('legal') || text.includes('citizenship') || text.includes('law') || text.includes('permit') || text.includes('visa') || text.includes('power of attorney')) return 'legal';
  if (text.includes('living') || text.includes('expat') || text.includes('lifestyle') || text.includes('healthcare') || text.includes('education') || text.includes('culture')) return 'living';
  if (text.includes('investment') || text.includes('off-plan') || text.includes('citizenship by investment')) return 'investment';
  if (text.includes('finance') || text.includes('mortgage') || text.includes('banking') || text.includes('cost') || text.includes('expense') || text.includes('tax') || text.includes('crypto') || text.includes('bitcoin')) return 'finance';
  return 'property';
}

interface CategoryHeroProps {
  category: CategoryKey;
  title: string;
  excerpt?: string;
  /** small chip text shown above the title, e.g. "5 min read · Dubai" */
  meta?: React.ReactNode;
}

const CategoryHero: React.FC<CategoryHeroProps> = ({ category, title, excerpt, meta }) => {
  const cfg = CATEGORY_MAP[category] ?? CATEGORY_MAP.all;
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl mb-8 shadow-elegant"
      style={{ background: cfg.gradient }}
    >
      {/* Decorative pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: cfg.pattern }}
        aria-hidden="true"
      />

      {/* Floating circle accents */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: cfg.accent }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: cfg.accent }}
        aria-hidden="true"
      />

      <div className="relative z-10 px-6 py-12 md:px-12 md:py-16 text-primary-foreground">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/25">
            <Icon className="w-6 h-6" strokeWidth={2.2} />
          </div>
          <span className="uppercase tracking-[0.2em] text-xs font-semibold opacity-90">
            {cfg.label}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-4xl drop-shadow-sm">
          {title}
        </h1>

        {excerpt && (
          <p className="mt-4 text-base md:text-lg opacity-90 max-w-3xl leading-relaxed">
            {excerpt}
          </p>
        )}

        {meta && (
          <div className="mt-6 text-sm opacity-85 flex flex-wrap items-center gap-3">
            {meta}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CategoryHero;
