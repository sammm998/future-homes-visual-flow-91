import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, MapPin, Home, Building, Store, Filter, Wand2, Check } from "lucide-react";
import AiSearchDialog, { COPY as AI_COPY } from "@/components/AiSearchDialog";
import { getCurrentLanguage as getLangFromPath } from "@/utils/seoUtils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { findPropertyLocationByRefNo } from "@/utils/propertyRouting";
import { useTranslation } from "@/hooks/useTranslation";

export function HeroSearch() {
  const [showAi, setShowAi] = useState(false);
  const navigate = useNavigate();
  const { selectedCurrency, formatPrice } = useCurrency();
  const { t } = useTranslation();

  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [location, setLocation] = useState("");
  const [refNo, setRefNo] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Advanced search filters
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minSqFt, setMinSqFt] = useState("");
  const [maxSqFt, setMaxSqFt] = useState("");
  const [pool, setPool] = useState(false);
  const [gym, setGym] = useState(false);
  const [garden, setGarden] = useState(false);
  const [parking, setParking] = useState(false);
  const [seaView, setSeaView] = useState(false);
  const [security, setSecurity] = useState(false);
  const [forResidencePermit, setForResidencePermit] = useState(false);
  const [readyToMove, setReadyToMove] = useState(false);
  const [underConstruction, setUnderConstruction] = useState(false);

  const priceOptions = useMemo(() => {
    const basePrices = [100000, 200000, 500000, 1000000, 2000000, 5000000];
    return basePrices.map(price => ({
      value: price.toString(),
      label: formatPrice(price)
    }));
  }, [selectedCurrency, formatPrice]);

  const handleSearch = useCallback(async () => {
    const searchParams = new URLSearchParams();

    if (propertyType) searchParams.set('propertyType', propertyType.toLowerCase());
    if (bedrooms) searchParams.set('bedrooms', bedrooms);
    if (location) searchParams.set('location', location);
    if (refNo) searchParams.set('referenceNo', refNo);
    if (minPrice) {
      searchParams.set('minPrice', minPrice);
      searchParams.set('priceMin', minPrice);
    }
    if (maxPrice) {
      searchParams.set('maxPrice', maxPrice);
      searchParams.set('priceMax', maxPrice);
    }
    if (minSqFt) {
      searchParams.set('minSquareFeet', minSqFt);
      searchParams.set('areaMin', minSqFt);
    }
    if (maxSqFt) {
      searchParams.set('maxSquareFeet', maxSqFt);
      searchParams.set('areaMax', maxSqFt);
    }
    if (sortBy) searchParams.set('sortBy', sortBy.toLowerCase().replace(' ', '-'));

    const facilities: string[] = [];
    const amenities: string[] = [];
    if (pool) {
      facilities.push('swimming-pool', 'pool');
      amenities.push('pool', 'swimming', 'zwembad');
    }
    if (gym) {
      facilities.push('gym', 'fitness');
      amenities.push('gym', 'fitness', 'sportschool');
    }
    if (garden) {
      facilities.push('garden');
      amenities.push('garden', 'tuin', 'trädgård');
    }
    if (parking) {
      facilities.push('parking', 'garage');
      amenities.push('parking', 'garage', 'parkering');
    }
    if (seaView) {
      facilities.push('sea-view');
      amenities.push('sea view', 'havsutsikt', 'zeezicht');
    }
    if (security) {
      facilities.push('security');
      amenities.push('security', 'säkerhet', 'beveiliging');
    }

    if (facilities.length > 0) {
      searchParams.set('facilities', facilities.join(','));
      searchParams.set('amenities', amenities.join(','));
    }

    const statuses: string[] = [];
    if (forResidencePermit) statuses.push('residence-permit');
    if (readyToMove) statuses.push('ready-to-move');
    if (underConstruction) statuses.push('under-construction');

    if (statuses.length > 0) {
      searchParams.set('status', statuses.join(','));
    }

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
      targetRoute = await findPropertyLocationByRefNo(refNo);
    } else if (location) {
      targetRoute = locationRoutes[location] || '/antalya';
    }

    navigate(`${targetRoute}?${searchParams.toString()}`);
  }, [propertyType, bedrooms, location, refNo, sortBy, minPrice, maxPrice, minSqFt, maxSqFt, pool, gym, garden, parking, seaView, security, forResidencePermit, readyToMove, underConstruction, navigate]);

  return (
    <Card className="mx-auto max-w-6xl rounded-lg border-border/70 bg-background p-2 shadow-[var(--shadow-luxe)] sm:p-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-1 lg:grid-cols-7 lg:gap-0 lg:divide-x lg:divide-border">
        <div className="rounded-lg border border-border/60 bg-ivory/45 px-1.5 transition-colors focus-within:border-gold lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:col-span-1">
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="h-12 border-0 bg-transparent text-sm font-semibold text-foreground focus:ring-gold sm:h-14">
              <SelectValue placeholder={t('search.property_type')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartments">
                <div className="flex items-center gap-2">
                  <Building size={16} />
                  {t('search.apartments')}
                </div>
              </SelectItem>
              <SelectItem value="houses">
                <div className="flex items-center gap-2">
                  <Home size={16} />
                  {t('search.houses')}
                </div>
              </SelectItem>
              <SelectItem value="villas">
                <div className="flex items-center gap-2">
                  <Home size={16} />
                  {t('search.villas')}
                </div>
              </SelectItem>
              <SelectItem value="commercial">
                <div className="flex items-center gap-2">
                  <Store size={16} />
                  {t('search.commercial')}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-border/60 bg-ivory/45 px-1.5 transition-colors focus-within:border-gold lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:col-span-1">
          <Select value={bedrooms} onValueChange={setBedrooms}>
            <SelectTrigger className="h-12 border-0 bg-transparent text-sm font-semibold text-foreground focus:ring-gold sm:h-14">
              <SelectValue placeholder={t('search.bedrooms')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="studio">{t('search.studio')}</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-border/60 bg-ivory/45 px-1.5 transition-colors focus-within:border-gold lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:col-span-1">
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="h-12 border-0 bg-transparent text-sm font-semibold text-foreground focus:ring-gold sm:h-14">
              <SelectValue placeholder={t('search.location')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Antalya"><div className="flex items-center gap-2"><MapPin size={16} />Antalya</div></SelectItem>
              <SelectItem value="Istanbul"><div className="flex items-center gap-2"><MapPin size={16} />Istanbul</div></SelectItem>
              <SelectItem value="Mersin"><div className="flex items-center gap-2"><MapPin size={16} />Mersin</div></SelectItem>
              <SelectItem value="Cyprus"><div className="flex items-center gap-2"><MapPin size={16} />Cyprus</div></SelectItem>
              <SelectItem value="Bali"><div className="flex items-center gap-2"><MapPin size={16} />Bali</div></SelectItem>
              <SelectItem value="Dubai"><div className="flex items-center gap-2"><MapPin size={16} />Dubai</div></SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-border/60 bg-ivory/45 px-1.5 transition-colors focus-within:border-gold lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:col-span-1">
          <Input
            placeholder={t('search.ref_no')}
            value={refNo}
            onChange={(e) => setRefNo(e.target.value)}
            className="h-12 border-0 bg-transparent text-sm font-semibold text-foreground placeholder:text-muted-foreground focus-visible:ring-gold sm:h-14"
          />
        </div>

        <div className="rounded-lg border border-border/60 bg-ivory/45 px-1.5 transition-colors focus-within:border-gold lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:col-span-1">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-12 border-0 bg-transparent text-sm font-semibold text-foreground focus:ring-gold sm:h-14">
              <SelectValue placeholder={t('search.sort_by')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-low">{t('search.price_low')}</SelectItem>
              <SelectItem value="price-high">{t('search.price_high')}</SelectItem>
              <SelectItem value="newest">{t('search.newest')}</SelectItem>
              <SelectItem value="oldest">{t('search.oldest')}</SelectItem>
              <SelectItem value="area-large">{t('search.area_largest')}</SelectItem>
              <SelectItem value="area-small">{t('search.area_smallest')}</SelectItem>
              <SelectItem value="bedrooms-most">{t('search.most_bedrooms')}</SelectItem>
              <SelectItem value="bedrooms-least">{t('search.least_bedrooms')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2 p-1 sm:col-span-2 sm:flex-row sm:items-center lg:col-span-2">
          <Dialog open={showAdvanced} onOpenChange={setShowAdvanced}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-12 w-full justify-center gap-2 border border-border/60 bg-transparent text-sm font-semibold text-muted-foreground hover:bg-ivory hover:text-foreground sm:h-14 sm:w-auto lg:border-0 lg:px-3" title={t('search.advanced')}>
              <Filter size={14} className="shrink-0" />
              <span aria-hidden="true" className="truncate lg:hidden">{t('search.advanced')}</span>
              <span className="sr-only">{t('search.advanced')}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[calc(100vw-2rem)] max-w-2xl overflow-hidden rounded-2xl border border-gold/25 bg-ivory p-0 text-foreground shadow-[var(--shadow-luxe)]">
            <div className="h-1 w-full bg-gold" />
            <div className="max-h-[85vh] overflow-y-auto p-5 sm:p-8">
            <DialogHeader className="text-center">
              <span className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-navy">
                <Filter className="h-3 w-3 text-gold" />
                Future Homes
              </span>
              <DialogTitle className="text-center text-2xl font-semibold text-navy sm:text-3xl">{t('search.advanced')}</DialogTitle>
            </DialogHeader>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label className="mb-3 block text-center text-[11px] font-bold uppercase tracking-[0.14em] text-navy/70 md:text-left">{t('search.price_range')}</Label>
                <div className="flex gap-2">
                  <Select value={minPrice} onValueChange={setMinPrice}>
                    <SelectTrigger className="h-12 rounded-xl border-navy/15 bg-background">
                      <SelectValue placeholder={t('search.min_price')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">{selectedCurrency.symbol}0</SelectItem>
                      {priceOptions.slice(0, 4).map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={maxPrice} onValueChange={setMaxPrice}>
                    <SelectTrigger className="h-12 rounded-xl border-navy/15 bg-background">
                      <SelectValue placeholder={t('search.max_price')} />
                    </SelectTrigger>
                    <SelectContent>
                      {priceOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                      <SelectItem value="5000000">{formatPrice(5000000)}+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="mb-3 block text-center text-[11px] font-bold uppercase tracking-[0.14em] text-navy/70 md:text-left">{t('search.square_feet')}</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min."
                    value={minSqFt}
                    onChange={(e) => setMinSqFt(e.target.value)}
                    className="h-12 rounded-xl border-navy/15 bg-background"
                  />
                  <Input
                    placeholder="Max."
                    value={maxSqFt}
                    onChange={(e) => setMaxSqFt(e.target.value)}
                    className="h-12 rounded-xl border-navy/15 bg-background"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <Label className="mb-3 block text-center text-[11px] font-bold uppercase tracking-[0.14em] text-navy/70 md:text-left">{t('search.facilities')}</Label>
                <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2 sm:grid-cols-3">
                  {[
                    { id: "pool", checked: pool, set: setPool, label: t('search.pool') },
                    { id: "gym", checked: gym, set: setGym, label: t('search.gym') },
                    { id: "garden", checked: garden, set: setGarden, label: t('search.garden') },
                    { id: "parking", checked: parking, set: setParking, label: t('search.parking') },
                    { id: "seaView", checked: seaView, set: setSeaView, label: t('search.sea_view') },
                    { id: "security", checked: security, set: setSecurity, label: t('search.security') },
                    { id: "forResidencePermit", checked: forResidencePermit, set: setForResidencePermit, label: t('search.residence_permit') },
                    { id: "readyToMove", checked: readyToMove, set: setReadyToMove, label: t('search.ready_to_move') },
                    { id: "underConstruction", checked: underConstruction, set: setUnderConstruction, label: t('search.under_construction') },
                  ].map((f) => (
                    <Label
                      key={f.id}
                      htmlFor={f.id}
                      className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-3 text-center text-sm font-medium transition-colors ${
                        f.checked
                          ? "border-gold bg-gold/15 text-navy"
                          : "border-navy/15 bg-background text-foreground/80 hover:border-gold/50"
                      }`}
                    >
                      <Checkbox
                        id={f.id}
                        checked={f.checked}
                        onCheckedChange={(checked) => f.set(checked === true)}
                        className="sr-only"
                      />
                      {f.checked && <Check className="h-4 w-4 shrink-0 text-gold" />}
                      <span className="leading-tight">{f.label}</span>
                    </Label>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-7">
              <Button onClick={handleSearch} className="h-13 w-full rounded-xl bg-navy py-3.5 text-base font-semibold text-navy-foreground hover:bg-navy/90">
                <Search size={16} className="mr-2" />
                {t('search.search')}
              </Button>
            </div>
            </div>
          </DialogContent>
          </Dialog>
        <Button type="button" onClick={() => setShowAi(true)} variant="outline" className="h-12 w-full shrink-0 justify-center gap-2 border-gold bg-gold/10 px-4 font-semibold text-navy hover:bg-gold hover:text-gold-foreground sm:h-14 sm:w-auto">
          <Wand2 size={14} className="mr-1" />
          <span suppressHydrationWarning>{(AI_COPY[getLangFromPath()] || AI_COPY.en).title}</span>
        </Button>
        <AiSearchDialog open={showAi} onOpenChange={setShowAi} />
        <Button onClick={handleSearch} className="h-12 w-full justify-center gap-2 bg-navy px-5 text-navy-foreground shadow-lg hover:bg-navy/90 sm:h-14 sm:flex-1">
          <Search size={14} className="mr-1" />
          {t('search.search')}
        </Button>
        </div>
      </div>
    </Card>
  );
}

export default HeroSearch;
