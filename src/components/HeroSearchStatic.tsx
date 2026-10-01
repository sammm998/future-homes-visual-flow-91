import { useTranslation } from "@/hooks/useTranslation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSearchStatic() {
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();

    const propertyType = formData.get('propertyType') as string;
    const bedrooms = formData.get('bedrooms') as string;
    const location = formData.get('location') as string;
    const refNo = formData.get('refNo') as string;
    const sortBy = formData.get('sortBy') as string;

    if (propertyType) params.set('propertyType', propertyType.toLowerCase());
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (location) params.set('location', location);
    if (refNo) params.set('referenceNo', refNo);
    if (sortBy) params.set('sortBy', sortBy.toLowerCase().replace(' ', '-'));

    const locationRoutes: Record<string, string> = {
      'Antalya': '/antalya',
      'Istanbul': '/istanbul',
      'Dubai': '/dubai',
      'Cyprus': '/cyprus',
      'Mersin': '/mersin',
      'Bali': '/bali'
    };

    let targetRoute = '/antalya';
    if (refNo) {
      targetRoute = '/property-for-sale-in-turkey';
    } else if (location) {
      targetRoute = locationRoutes[location] || '/antalya';
    }

    window.location.href = `${targetRoute}?${params.toString()}`;
  };

  const selectClass = "h-12 w-full appearance-none rounded-md border-0 bg-transparent px-4 text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-gold/40 sm:h-14";
  const inputClass = "h-12 w-full rounded-md border-0 bg-transparent px-4 text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-gold/40 sm:h-14";

  return (
    <div className="mx-auto max-w-6xl rounded-lg border border-border/70 bg-background p-2 shadow-[var(--shadow-luxe)] sm:p-3">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-0 lg:grid-cols-6 lg:divide-x lg:divide-border">
        <div className="rounded-lg border border-border/60 bg-ivory/45 px-1.5 transition-colors focus-within:border-gold sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 lg:col-span-1">
          <label htmlFor="propertyType" className="sr-only">{t('search.property_type')}</label>
          <select id="propertyType" name="propertyType" aria-label={t('search.property_type')} className={selectClass} defaultValue="">
            <option value="">{t('search.property_type')}</option>
            <option value="apartments">{t('search.apartments')}</option>
            <option value="houses">{t('search.houses')}</option>
            <option value="villas">{t('search.villas')}</option>
            <option value="commercial">{t('search.commercial')}</option>
          </select>
        </div>

        <div className="rounded-lg border border-border/60 bg-ivory/45 px-1.5 transition-colors focus-within:border-gold sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 lg:col-span-1">
          <label htmlFor="bedrooms" className="sr-only">{t('search.bedrooms')}</label>
          <select id="bedrooms" name="bedrooms" aria-label={t('search.bedrooms')} className={selectClass} defaultValue="">
            <option value="">{t('search.bedrooms')}</option>
            <option value="studio">{t('search.studio')}</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5+</option>
          </select>
        </div>

        <div className="rounded-lg border border-border/60 bg-ivory/45 px-1.5 transition-colors focus-within:border-gold sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 lg:col-span-1">
          <label htmlFor="location" className="sr-only">{t('search.location')}</label>
          <select id="location" name="location" aria-label={t('search.location')} className={selectClass} defaultValue="">
            <option value="">{t('search.location')}</option>
            <option value="Antalya">Antalya</option>
            <option value="Istanbul">Istanbul</option>
            <option value="Mersin">Mersin</option>
            <option value="Cyprus">Cyprus</option>
            <option value="Bali">Bali</option>
            <option value="Dubai">Dubai</option>
          </select>
        </div>

        <div className="rounded-lg border border-border/60 bg-ivory/45 px-1.5 transition-colors focus-within:border-gold sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 lg:col-span-1">
          <label htmlFor="refNo" className="sr-only">{t('search.ref_no')}</label>
          <input
            id="refNo"
            name="refNo"
            type="text"
            aria-label={t('search.ref_no')}
            placeholder={t('search.ref_no')}
            className={inputClass}
          />
        </div>

        <div className="rounded-lg border border-border/60 bg-ivory/45 px-1.5 transition-colors focus-within:border-gold sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 lg:col-span-1">
          <label htmlFor="sortBy" className="sr-only">{t('search.sort_by')}</label>
          <select id="sortBy" name="sortBy" aria-label={t('search.sort_by')} className={selectClass} defaultValue="">
            <option value="">{t('search.sort_by')}</option>
            <option value="price-low">{t('search.price_low')}</option>
            <option value="price-high">{t('search.price_high')}</option>
            <option value="newest">{t('search.newest')}</option>
            <option value="oldest">{t('search.oldest')}</option>
            <option value="area-large">{t('search.area_largest')}</option>
            <option value="area-small">{t('search.area_smallest')}</option>
            <option value="bedrooms-most">{t('search.most_bedrooms')}</option>
            <option value="bedrooms-least">{t('search.least_bedrooms')}</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 p-1 lg:col-span-1">
          <Button
            type="submit"
            aria-label={t('search.search')}
            className="h-12 w-full justify-center bg-navy px-6 text-navy-foreground shadow-lg hover:bg-navy/90 sm:h-14"
          >
            <Search size={14} className="mr-1" aria-hidden="true" />
            {t('search.search')}
          </Button>
        </div>
      </form>
    </div>
  );

}

export default HeroSearchStatic;
