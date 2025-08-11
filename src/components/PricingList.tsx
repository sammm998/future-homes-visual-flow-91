import React from 'react';
import { usePropertyPricingByRef } from '@/hooks/usePropertyFeed';

interface PricingListProps {
  refNo: string;
  title?: string;
  className?: string;
}

const toPrice = (v: string | number) => {
  const n = Number(String(v).replace(/[^0-9.]/g, ''));
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(n);
  } catch (e) {
    return `€${n.toLocaleString('en-US')}`;
  }
};

const PricingList: React.FC<PricingListProps> = ({ refNo, title = 'Pricing', className }) => {
  const { property, loading, error } = usePropertyPricingByRef(refNo);

  const list = property?.apartment_types ?? [];

  return (
    <section className={className}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
          {property?.title && (
            <p className="text-muted-foreground mt-2">{property.title} • Ref #{property.ref_no}</p>
          )}
        </header>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-destructive">Failed to load pricing: {error}</div>
        )}

        {!loading && !error && list.length === 0 && (
          <div className="text-muted-foreground">No pricing available for this property yet.</div>
        )}

        {!loading && list.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {list.map((apt, idx) => (
              <article key={idx} className="rounded-xl border bg-card text-card-foreground p-4 shadow-sm">
                <h3 className="text-lg font-semibold">{apt.type}</h3>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex flex-col">
                    <dt className="text-muted-foreground">Size</dt>
                    <dd className="text-foreground">{String(apt.size)} m²</dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-muted-foreground">From</dt>
                    <dd className="text-foreground font-medium">{toPrice(apt.price)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingList;
