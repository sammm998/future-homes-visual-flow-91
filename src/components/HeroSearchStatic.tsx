import { useTranslation } from "@/hooks/useTranslation";
import { Search, Filter } from "lucide-react";

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

  const selectClass = "h-12 sm:h-14 w-full bg-background text-foreground border border-border/60 text-sm rounded-md px-4 appearance-none outline-none focus:ring-2 focus:ring-brand-accent/60";
  const inputClass = "h-12 sm:h-14 w-full bg-background text-foreground border border-border/60 placeholder:text-muted-foreground text-sm rounded-md px-4 outline-none focus:ring-2 focus:ring-brand-accent/60";

  return (
    <div className="bg-brand-secondary/55 backdrop-blur-xl border border-brand-foreground/20 p-3 sm:p-4 md:p-5 rounded-lg max-w-6xl mx-auto shadow-2xl">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3">
        <div className="lg:col-span-1">
          <label htmlFor="propertyType" className="sr-only">{t('search.property_type')}</label>
          <select id="propertyType" name="propertyType" aria-label={t('search.property_type')} className={selectClass} defaultValue="">
            <option value="">{t('search.property_type')}</option>
            <option value="apartments">{t('search.apartments')}</option>
            <option value="houses">{t('search.houses')}</option>
            <option value="villas">{t('search.villas')}</option>
            <option value="commercial">{t('search.commercial')}</option>
          </select>
        </div>

        <div className="lg:col-span-1">
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

        <div className="lg:col-span-1">
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

        <div className="lg:col-span-1">
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

        <div className="lg:col-span-1">
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

        <div className="col-span-1 sm:col-span-2 lg:col-span-5 flex flex-col sm:flex-row gap-3 justify-end items-center pt-1">
          <button
            type="button"
            disabled
            aria-label={t('search.advanced')}
            className="w-full sm:w-auto inline-flex items-center justify-center min-h-11 px-5 text-xs rounded-md bg-brand-foreground/10 border border-brand-foreground/25 text-brand-foreground/75 cursor-not-allowed"
          >
            <Filter size={14} className="mr-1" aria-hidden="true" />
            {t('search.advanced')}
          </button>
          <button
            type="submit"
            aria-label={t('search.search')}
            className="w-full sm:w-auto inline-flex items-center justify-center min-h-11 px-7 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary-glow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Search size={14} className="mr-1" aria-hidden="true" />
            {t('search.search')}
          </button>
        </div>
      </form>
    </div>
  );

}

export default HeroSearchStatic;
