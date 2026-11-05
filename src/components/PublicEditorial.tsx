import type { ReactNode } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router-compat";
import { cn } from "@/lib/utils";
import ResponsiveImage from "@/components/ResponsiveImage";

type PublicPageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
  children?: ReactNode;
  compact?: boolean;
};

export function PublicPageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt = "",
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
  children,
  compact = false,
}: PublicPageHeroProps) {
  return (
    <section className="bg-ivory px-3 pb-10 pt-3 sm:px-5 lg:px-8 lg:pb-16">
      <div className={cn("relative overflow-hidden rounded-lg bg-navy shadow-[var(--shadow-luxe)]", compact ? "min-h-[390px] sm:min-h-[430px]" : "min-h-[460px] sm:min-h-[520px]")}> 
        {image ? (
          <ResponsiveImage
            src={image}
            alt={imageAlt}
            sizes="100vw"
            priority
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-55 transition-transform duration-1000 motion-safe:hover:scale-[1.02]"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/25" />
        <div className="relative z-10 mx-auto flex min-h-[inherit] max-w-7xl items-end px-5 py-10 sm:items-center sm:px-10 sm:py-20 lg:px-16">
          <div className="min-w-0 max-w-3xl animate-fade-in">
            <p className="mb-4 text-[10px] font-semibold uppercase text-gold sm:mb-5 sm:text-xs">{eyebrow}</p>
            <h1 className="max-w-3xl text-3xl font-semibold leading-[1.1] text-navy-foreground sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-navy-foreground/80 sm:mt-6 sm:text-lg">
              {description}
            </p>
            {(primaryLabel && primaryTo) || (secondaryLabel && secondaryTo) ? (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {primaryLabel && primaryTo ? (
                  <Button asChild size="lg" className="w-full bg-gold text-gold-foreground hover:bg-gold/90 sm:w-auto">
                    <Link to={primaryTo}>{primaryLabel}<ArrowRight /></Link>
                  </Button>
                ) : null}
                {secondaryLabel && secondaryTo ? (
                  <Button asChild size="lg" variant="outline" className="w-full border-navy-foreground/35 bg-navy-foreground/10 text-navy-foreground hover:bg-navy-foreground hover:text-navy sm:w-auto">
                    <Link to={secondaryTo}>{secondaryLabel}</Link>
                  </Button>
                ) : null}
              </div>
            ) : null}
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export function EditorialSectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("mb-8 max-w-3xl sm:mb-10", align === "center" && "mx-auto text-center")}> 
      <p className="mb-3 text-xs font-semibold uppercase text-gold-foreground">{eyebrow}</p>
      <h2 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl md:text-5xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p> : null}
    </div>
  );
}

export function EditorialCta({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
}: {
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryTo: string;
  secondaryLabel?: string;
  secondaryTo?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
      <div className="grid gap-8 rounded-lg bg-navy px-5 py-8 text-navy-foreground shadow-[var(--shadow-luxe)] sm:px-7 sm:py-10 md:grid-cols-[1fr_auto] md:items-end md:px-12 md:py-14">
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase text-gold">{eyebrow}</p>
          <h2 className="text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">{title}</h2>
          <p className="mt-4 max-w-2xl text-navy-foreground/75">{description}</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-navy-foreground/80">
            {["Local expertise", "Private guidance", "End-to-end support"].map((item) => (
              <span key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-gold" />{item}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
          <Button asChild size="lg" className="w-full bg-gold text-gold-foreground hover:bg-gold/90 sm:w-auto md:w-full">
            <Link to={primaryTo}>{primaryLabel}<ArrowRight /></Link>
          </Button>
          {secondaryLabel && secondaryTo ? (
            <Button asChild size="lg" variant="outline" className="w-full border-navy-foreground/30 bg-transparent text-navy-foreground hover:bg-navy-foreground hover:text-navy sm:w-auto md:w-full">
              <Link to={secondaryTo}>{secondaryLabel}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}