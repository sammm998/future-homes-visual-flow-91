import { buildPropertySeoTitle } from '@/lib/propertySeo.functions';
import React, { useState, useEffect } from "react";
import { useLoaderData } from "@tanstack/react-router";
import { useParams, Link, useNavigate, useLocation } from "@/lib/router-compat";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Timeline } from "@/components/ui/timeline";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone, Mail, ArrowLeft, ChevronLeft, ChevronRight, Bed, Bath, Square, Calendar, Car, Home, Plane, Waves, CheckCircle, Star, Award, Images, X, Share2, Check } from "lucide-react";
import Navigation from "@/components/Navigation";
import SEOHead from "@/components/SEOHead";
import { translateAmenity } from '@/utils/amenityTranslations';
import { propertyTypeLabel } from '@/utils/propertyTypeLabel';
import { useTranslation } from '@/hooks/useTranslation';
import { getLocaleFromPathname, localizePath, stripLocale } from "@/utils/localeRouting";
import {
  socialImage,
  buildPropertyStructuredData,
  propertyHreflangUrls,
  propertyUrl,
  type PropertySeoInput,
} from "@/utils/propertySeoSchema";
import SEOInternalLinks from "@/components/SEOInternalLinks";
import { useCurrency } from '@/contexts/CurrencyContext';
import { useProperty } from '@/hooks/useProperty';
import { formatPriceFromString } from '@/utils/priceFormatting';
import ervinaImage from '@/assets/ervina-koksel.webp';
import { buildPropertyUrl, PATH_TO_LANG } from "@/utils/slugHelpers";
// Using Batuhan Kunt's image
const batuhanImage = 'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/ukys641vbp.jpeg';
import { supabase } from '@/integrations/legacy/client';
import { OptimizedPropertyImage } from '@/components/OptimizedPropertyImage';
import { t } from '@/utils/translations';
import { ShareLinkButton } from '@/components/ShareLinkButton';
import LiveViewers from '@/components/LiveViewers';
import PropertySuggestions from '@/components/PropertySuggestions';
import { PropertyInquiry, PropertyStickyCta } from '@/components/PropertyInquiry';
import { PropertyHeroGallery } from '@/components/PropertyHeroGallery';
import PropertyScrollGallery from '@/components/PropertyScrollGallery';
import PropertyAreaInsights from '@/components/PropertyAreaInsights';
import { selectSearchPrice } from '@/utils/propertySearchSelection';

const parseCompletionDate = (value: string | null | undefined): Date | null => {
  if (!value) return null;
  const monthYear = value.trim().match(/^(0?[1-9]|1[0-2])\/(\d{4})$/);
  if (monthYear) return new Date(Number(monthYear[2]), Number(monthYear[1]) - 1, 1);
  const yearMonth = value.trim().match(/^(\d{4})-(0[1-9]|1[0-2])(?:-\d{2})?$/);
  if (yearMonth) return new Date(Number(yearMonth[1]), Number(yearMonth[2]) - 1, 1);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

// Function to map property location to route
const getLocationRoute = (location: string | undefined | null): string => {
  if (!location || typeof location !== 'string') return '/antalya'; // Default fallback

  const locationLower = location.toLowerCase();
  if (locationLower.includes('dubai')) return '/dubai';
  if (locationLower.includes('istanbul')) return '/istanbul';
  if (locationLower.includes('antalya')) return '/antalya';
  if (locationLower.includes('cyprus')) return '/cyprus';
  if (locationLower.includes('mersin')) return '/mersin';
  if (locationLower.includes('bali')) return '/bali';

  // Default to Antalya for unknown locations
  return '/antalya';
};

// Agent data with images
const getAgentData = (agentName: string) => {
  const agents: Record<string, any> = {
    "Ervina Köksel": {
      name: "Ervina Köksel",
      image: ervinaImage,
      titleKey: "pd.agent_sales_office_supervisor",
      experienceKey: "pd.agent_experienced_sales",
      specialtyKeys: ["pd.agent_property_sales", "pd.agent_customer_service", "pd.agent_office_management"]
    },
    "Batuhan Kunt": {
      name: "Batuhan Kunt",
      image: batuhanImage,
      titleKey: "pd.sales_representative",
      experienceKey: "pd.agent_investment_expert",
      specialtyKeys: ["pd.agent_property_investment", "pd.agent_customer_relations", "pd.agent_international_sales"]
    },
    "Dubai Properties Team": {
      name: "Dubai Properties Team",
      image: batuhanImage,
      titleKey: "pd.sales_representative",
      experienceKey: "pd.agent_international_team",
      specialtyKeys: ["pd.agent_international_sales", "pd.agent_property_investment", "pd.agent_customer_relations"]
    }
  };
  return agents[agentName] || {
    name: "Batuhan Kunt",
    image: batuhanImage,
    titleKey: "pd.sales_representative",
    experienceKey: "pd.agent_investment_expert",
    specialtyKeys: ["pd.agent_property_investment", "pd.agent_customer_relations", "pd.agent_international_sales"]
  };
};

// Get property data - database only approach with multi-language slug support
const getPropertyData = async (id: string) => {
  // Try database lookup - this is now the only source
  try {
    // Build OR filter for all slug columns (English + all translated slugs)
    const slugFilter = `slug.eq.${id},slug_sv.eq.${id},slug_tr.eq.${id},slug_ar.eq.${id},slug_ru.eq.${id},slug_no.eq.${id},slug_da.eq.${id},slug_fa.eq.${id},slug_ur.eq.${id},slug_es.eq.${id},slug_de.eq.${id},slug_fr.eq.${id},slug_id.eq.${id}`;
    
    // Try to find by any slug first (SEO-friendly URLs)
    let { data: dbProperty, error } = await supabase
      .from('properties')
      .select('*')
      .or(slugFilter)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    // If not found by any slug, try by ref_no
    if (!dbProperty && !error) {
      const result = await supabase
        .from('properties')
        .select('*')
        .eq('ref_no', id)
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();
      dbProperty = result.data;
      error = result.error;
    }

    // If not found by ref_no, try by UUID
    if (!dbProperty && !error) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(id)) {
        const result = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .eq('is_active', true)
          .maybeSingle();
        dbProperty = result.data;
        error = result.error;
      }
    }
    
    if (!error && dbProperty) {
      // Parse the facilities array and convert to clean format
      let facilities: string[] = [];
      if (dbProperty.property_facilities && Array.isArray(dbProperty.property_facilities)) {
        facilities = dbProperty.property_facilities;
      } else if (typeof dbProperty.facilities === 'string') {
        facilities = dbProperty.facilities.split(',').map(f => f.trim());
      }

      // Clean up facilities - remove duplicates and empty values
      facilities = [...new Set(facilities.filter(f => f && f.trim()))];

      // Parse property images
      let images: string[] = [];
      if (dbProperty.property_images && Array.isArray(dbProperty.property_images)) {
        images = dbProperty.property_images;
      }
      if (dbProperty.property_image) {
        images = [dbProperty.property_image, ...images];
      }

      // Parse pricing from apartment_types (prioritized) or property_prices_by_room (fallback)
      let pricing: any[] = [];

      // First try apartment_types if available
      if (dbProperty.apartment_types) {
        try {
          const apartmentTypes = typeof dbProperty.apartment_types === 'string' ? JSON.parse(dbProperty.apartment_types) : dbProperty.apartment_types;
          if (Array.isArray(apartmentTypes) && apartmentTypes.length > 0) {
            pricing = apartmentTypes.map((apt: any) => ({
              type: apt.type ? `${apt.type} Apartment` : 'Apartment',
              size: apt.size ? `${apt.size}m²` : '',
              price: apt.price ? `€${apt.price.toLocaleString('en-US')}` : ''
            }));
          }
        } catch (error) {
          console.warn('Failed to parse apartment_types:', error);
        }
      }

      // Fallback to property_prices_by_room if no apartment_types
      if (pricing.length === 0 && dbProperty.property_prices_by_room) {
        const priceText = dbProperty.property_prices_by_room;
        const priceMatches = priceText.split(';');
        pricing = priceMatches.map((match: string) => {
          const parts = match.trim().split(' - ');
          if (parts.length >= 3) {
            return {
              type: parts[0].trim(),
              size: parts[1].trim(),
              price: parts[2].trim()
            };
          }
          return null;
        }).filter(Boolean);
      }
      return {
        id: dbProperty.ref_no,
        title: dbProperty.title,
        location: dbProperty.location,
        price: `€${dbProperty.price || dbProperty.starting_price_eur}`,
        bedrooms: dbProperty.bedrooms,
        bathrooms: dbProperty.bathrooms,
        area: dbProperty.sizes_m2,
        propertyType: dbProperty.property_type || "Apartments",
        refNo: dbProperty.ref_no,
        buildingComplete: dbProperty.building_complete_date,
        description: dbProperty.description,
        features: facilities,
        facilities: facilities,
        pricing: pricing,
        images: images,
        distanceToAirport: dbProperty.distance_to_airport_km ? `${dbProperty.distance_to_airport_km} km` : undefined,
        distanceToBeach: dbProperty.distance_to_beach_km ? `${dbProperty.distance_to_beach_km} km` : undefined,
        agent: "Batuhan Kunt",
        contactPhone: "+905523032750",
        contactEmail: "info@futurehomesinternational.com"
      };
    }
  } catch (err) {
    // Database lookup failed silently
  }

  // Property not found
  return null;
};
const PropertyDetail = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang: language } = useTranslation();
  const lang = language;
  // During SSR there is no ?lang= param, so derive the SEO language from the
  // URL prefix (/tr/mulk/1046) to keep metadata and schema in the right language.
  // Some URLs carry the localized segment without a locale prefix
  // (e.g. /properti/1453). Infer the language from that segment so the
  // canonical points at the prefixed, localized URL.
  const segmentLang = PATH_TO_LANG[location.pathname.split('/').filter(Boolean)[0] || ''] || null;
  const seoLanguage = getLocaleFromPathname(location.pathname) || segmentLang || language;
  const {
    formatPrice
  } = useCurrency();

  // Use the database-focused useProperty hook for all lookups
  const {
    property: sourceProperty,
    loading,
    error
  } = useProperty(id || '');
  const selectedBedrooms = new URLSearchParams(location.search).get('bedrooms') || '';
  const property = sourceProperty ? { ...sourceProperty, selectedBedrooms, price: selectSearchPrice(sourceProperty, selectedBedrooms) } : null;
  // Server-rendered SEO data (fetched in the route loader) so crawlers get the
  // real, translated title/description before client data arrives.
  const routeSeo = (useLoaderData({ strict: false }) as { seo?: (PropertySeoInput & { title: string; description: string }) | null } | undefined)?.seo ?? null;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  // Redirect to fully translated URL whenever property data is available.
  // This handles: initial load with ?lang=sv, language changes, and mismatched paths.
  useEffect(() => {
    if (!property) return;

    // During client-side navigation this component can remain mounted for one
    // render after the URL changes. Never redirect from a destination page
    // (for example /id/antalya) back into the property detail route.
    const pathParts = stripLocale(location.pathname).split('/').filter(Boolean);
    const isPropertyPath =
      pathParts.length === 2 && Boolean(PATH_TO_LANG[pathParts[0]]);
    if (!isPropertyPath) return;
    
    const expectedUrl = buildPropertyUrl(property, lang);
    const expectedPathname = expectedUrl.split('?')[0];
    const currentUrl = `${location.pathname}${location.search}`;

    // Redirect if pathname doesn't match (wrong path segment or slug)
    if (location.pathname !== expectedPathname || currentUrl !== expectedUrl) {
      navigate(expectedUrl, {
        replace: true,
        state: location.state
      });
    }
  }, [property, lang, location.pathname, location.search, location.state, navigate]);

  // Preload critical images for faster display
  useEffect(() => {
    if (property?.images && property.images.length > 0) {
      // Preload first 3 images for faster gallery experience
      property.images.slice(0, 3).forEach((imageSrc: string, index: number) => {
        const img = new Image();
        img.src = imageSrc;
        if (index === 0) {
          img.fetchPriority = 'high';
        }
      });
    }
  }, [property?.images]);

  // Optimized loading state with skeleton
  if (loading) {
    // SSR title: keep it inside the ~60 char SERP limit and end with the REF
    // so every property gets a short, unique, translated title.
    const ssrTitle = routeSeo
      ? buildPropertySeoTitle(routeSeo, seoLanguage, seoLanguage === 'en' ? 'Bed' : t('pd.bedrooms', seoLanguage))
      : 'Property for Sale | Future Homes';
    return <div className="min-h-screen bg-background">
        <SEOHead
          title={ssrTitle}
          description={routeSeo?.description || "Explore this property for sale in Turkey, Dubai, Cyprus or Bali with Future Homes International."}

          ogImage={socialImage(routeSeo?.image)}
          ogType="product"
          canonicalUrl={routeSeo ? propertyUrl(routeSeo, seoLanguage) : undefined}
          hreflangUrls={routeSeo?.refNo ? propertyHreflangUrls(routeSeo) : undefined}
          structuredData={routeSeo ? buildPropertyStructuredData(routeSeo, seoLanguage, {
            home: t('nav.home', seoLanguage),
            properties: t('nav.properties', seoLanguage),
          }) : undefined}
        />
        <Navigation />
        <h1 className="sr-only">{routeSeo?.title || 'Property for sale'}</h1>
        <div className="container mx-auto px-4 pt-24 pb-16 max-w-7xl">
          {/* Skeleton loader for faster perceived performance */}
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded-sm w-32 mb-8"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-4">
                  <div className="h-8 bg-muted rounded-sm w-3/4"></div>
                  <div className="h-6 bg-muted rounded-sm w-1/2"></div>
                  <div className="h-8 bg-muted rounded-sm w-1/3"></div>
                </div>
                <div className="aspect-[16/10] bg-muted rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-64 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>;
  }

  // Show error state
  if (error) {
    return <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-32">
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Home className="h-12 w-12 text-muted-foreground" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-4">{t('pd.not_found', language)}</h1>
                <p className="text-muted-foreground text-lg mb-8">
                  {error || t('pd.not_found_desc', language)}
                </p>
              </div>
              
              <div className="space-y-4">
                <Button onClick={() => navigate(-1)} variant="outline" className="w-full" size="lg">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('pd.go_back', language)}
                </Button>
                
                <Button onClick={() => navigate('/')} className="w-full" size="lg">
                  <Home className="h-4 w-4 mr-2" />
                  {t('pd.go_home', language)}
                </Button>
              </div>
              
              <div className="mt-8 p-6 bg-muted/50 rounded-2xl">
                <p className="text-sm text-muted-foreground">
                  <strong>{t('pd.tip', language)}:</strong> {t('pd.not_found_tip', language)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>;
  }

  // Show property not found if no property data
  if (!property) {
    return <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-32">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">{t('pd.not_found', language)}</h1>
            <p className="text-muted-foreground text-lg mb-8">
              {t('pd.not_found_removed', language)}
            </p>
            <Button onClick={() => navigate('/')} className="inline-flex items-center" size="lg">
              <Home className="h-4 w-4 mr-2" />
              {t('pd.back_to_properties', language)}
            </Button>
          </div>
          <PropertySuggestions heading={t('pd.similar_properties', language)} />
        </div>
      </div>;
  }
  const nextImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex(prev => (prev + 1) % property.images.length);
    }
  };
  const prevImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex(prev => (prev - 1 + property.images.length) % property.images.length);
    }
  };
  const getTimelineData = () => {
    const timeline = [];
    timeline.push({
      title: t('pd.timeline_listed', language),
      content: t('pd.timeline_listed_desc', language),
      date: t('pd.available_now', language)
    });
    if (property.buildingComplete) {
      const completionDate = parseCompletionDate(property.buildingComplete);
      if (!completionDate) return timeline;
      const isCompleted = completionDate <= new Date();
      timeline.push({
        title: isCompleted ? t('pd.timeline_completed', language) : t('pd.timeline_expected', language),
        content: isCompleted ? t('pd.timeline_completed_desc', language) : t('pd.timeline_expected_desc', language),
        date: completionDate.toLocaleDateString(language === 'en' ? 'en-US' : language, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      });
    }
    timeline.push({
      title: t('pd.timeline_ready', language),
      content: t('pd.timeline_ready_desc', language),
      date: t('pd.contact_us', language)
    });
    return timeline;
  };
  const agent = getAgentData(property.agent);

  // Generate SEO metadata (Title ≤60 chars, Description ≤160 chars)
  const truncate = (s: string, n: number) => {
    const t = (s || '').trim();
    if (t.length <= n) return t;
    const cut = t.slice(0, n - 1);
    const lastSpace = cut.lastIndexOf(' ');
    return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:-]+$/, '') + '…';
  };
  const refLabel = property.refNo || property.ref_no || property.id;
  const brandSuffix = refLabel ? ` | REF ${refLabel}` : ' | Future Homes';
  const propertyTitle = buildPropertySeoTitle({
    title: property.title,
    bedrooms: property.bedrooms,
    propertyType: property.propertyType,
    district: (property as any).property_district || routeSeo?.district,
    location: (property as any).location_original || property.location,
    refNo: refLabel,
  }, seoLanguage, seoLanguage === 'en' ? 'Bed' : t('pd.bedrooms', seoLanguage));

  const descParts = [
    property.bedrooms ? `${property.bedrooms} ${t('pd.bedrooms', seoLanguage)}` : null,
    property.bathrooms ? `${property.bathrooms} ${t('pd.bathrooms', seoLanguage)}` : null,
    property.area ? `${property.area} m²` : null,
  ].filter(Boolean).join(', ');
  const localizedDescription = (property.description || routeSeo?.description || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const rawDesc = localizedDescription.length >= 80
    ? localizedDescription
    : [
        [property.title, property.location].filter(Boolean).join(', '),
        descParts,
        property.price || '',
      ].filter(Boolean).join('. ') + '.';
  const propertyDescription = truncate(rawDesc, 160);

  const propertyKeywords = `${property.location || 'property'} property, ${property.propertyType || 'real estate'}, ${property.bedrooms || ''} bedroom ${property.propertyType?.toLowerCase() || 'property'}, real estate ${property.location || ''}, property for sale ${property.location || ''}`;

  const canonicalUrl = `https://futurehomesinternational.com${buildPropertyUrl(property, seoLanguage)}`;
  const fallbackReturnUrl = localizePath(
    getLocationRoute(property.location),
    getLocaleFromPathname(location.pathname),
  );
  const stateReturnUrl = location.state?.returnUrl;
  const returnUrl =
    typeof stateReturnUrl === 'string' &&
    stateReturnUrl.startsWith('/') &&
    stateReturnUrl !== `${location.pathname}${location.search}`
      ? stateReturnUrl
      : fallbackReturnUrl;
  const seoProperty: PropertySeoInput = {
    title: property.title,
    description: property.description || propertyDescription,
    image: property.images?.[0] || property.image || routeSeo?.image,
    images: property.images || (property.image ? [property.image] : []),
    refNo: property.refNo || routeSeo?.refNo || property.id,
    id: property.id,
    location: property.location,
    district: property.district || routeSeo?.district,
    country: property.country || routeSeo?.country,
    price: property.price,
    currency: property.currency || routeSeo?.currency,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    propertyType: property.propertyType,
  };
  return <div className="min-h-screen bg-ivory/35">
      <SEOHead
        title={propertyTitle}
        description={propertyDescription}
        keywords={propertyKeywords}
        canonicalUrl={canonicalUrl}
        ogType="product"
        ogImage={socialImage(seoProperty.image)}
        hreflangUrls={propertyHreflangUrls(seoProperty)}
        structuredData={buildPropertyStructuredData(seoProperty, seoLanguage, {
          home: t('nav.home', seoLanguage),
          properties: t('nav.properties', seoLanguage),
        })}
      />
      <Navigation />
      
      {/* Image Modal */}
      {showImageModal && property.images && <PropertyScrollGallery images={property.images} title={property.title} location={property.location} startIndex={currentImageIndex} onClose={() => setShowImageModal(false)} />}

      <div className="container mx-auto max-w-[1440px] px-4 pb-28 pt-6 sm:pt-10 lg:pb-20">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-4">
          <Link to={returnUrl} onClick={event => {
            if (typeof stateReturnUrl === 'string') {
              event.preventDefault();
              navigate(-1);
            }
          }}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('pd.back_to_properties', language)}
          </Link>
        </Button>

        <div className="mb-8 sm:mb-12">
          <PropertyHeroGallery
            images={property.images?.length ? property.images : [property.image].filter(Boolean)}
            alt={`${property.title} — ${property.propertyType || 'property'} in ${property.location || ''} (REF ${refLabel})`}
            lang={language}
            onOpen={(i) => { setCurrentImageIndex(i); setShowImageModal(true); }}
          />
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:items-start">
          {/* Main Content */}
          <div className="space-y-10 sm:space-y-14 lg:col-span-8">
            {/* Property Header */}
            <header className="space-y-4 border-b border-border pb-8 sm:space-y-5 sm:pb-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-sm bg-navy px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-navy-foreground">
                  REF {property.refNo || property.id}
                </span>
                {property.propertyType && <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{propertyTypeLabel(property.propertyType, language)}</span>}
              </div>

              <h1 className="max-w-4xl text-3xl font-semibold leading-[1.1] text-navy sm:text-4xl md:text-6xl">
                {property.title}
              </h1>

              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-5 w-5 mr-2 text-gold" />
                <span className="text-lg">{property.location}</span>
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 sm:flex sm:flex-wrap sm:justify-between sm:gap-4">
                <div className="min-w-0">
                  <div className="break-words text-2xl font-bold text-primary sm:text-3xl md:text-4xl">
                    {property.price ? formatPriceFromString(property.price, formatPrice) : t('home.price_on_request', language)}{Number(property.buyer_fee_percent) > 0 ? ` +${property.buyer_fee_percent}%` : ''}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                  <LiveViewers propertyId={property.refNo || property.id || ''} />
                  <ShareLinkButton refNo={property.refNo || property.ref_no} lang={lang} />
                </div>
              </div>
            </header>

            {/* Key specs strip */}
            <section className="space-y-5">
              <h2 className="text-2xl font-semibold">{t('pd.property_details', language)}</h2>
              <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-border bg-card text-foreground shadow-sm">
                {[
                  { icon: Bed, label: t('bedrooms', language), value: property.bedrooms || '—' },
                  { icon: Bath, label: t('bathrooms', language), value: property.bathrooms || '—' },
                  { icon: Square, label: t('area', language), value: property.area ? `${property.area} m²` : '—' },
                ].map(({ icon: Icon, label, value }, i) => (
                  <div key={i} className={`min-w-0 flex flex-col items-center gap-2 px-2 py-4 text-center sm:p-5 md:p-7 ${i > 0 ? 'border-l border-navy-foreground/10' : ''}`}>
                    <Icon className="h-6 w-6 text-gold" />
                    <p className="max-w-full break-words text-lg font-bold sm:text-xl md:text-2xl">{String(value).replace(/<>/g, ' – ')}</p>
                    <p className="max-w-full text-[9px] uppercase text-muted-foreground sm:text-[11px] sm:tracking-[0.18em] md:text-xs notranslate" translate="no">{label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Property Description */}
            {property.description && (() => {
              const text: string = property.description;
              const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);

              // Heuristic: a heading is a short line (<= 80 chars), no trailing period,
              // OR ends with a colon (e.g., "Project Features & Amenities").
              const isHeading = (p: string) => {
                if (p.length > 90) return false;
                if (p.includes('\n')) return false;
                const trimmed = p.trim();
                if (trimmed.endsWith(':')) return true;
                if (/[.!?]$/.test(trimmed)) return false;
                const words = trimmed.split(/\s+/);
                return words.length <= 10;
              };

              type Section = { heading?: string; body: string[] };
              const sections: Section[] = [];
              let current: Section = { body: [] };

              for (const p of paragraphs) {
                if (isHeading(p)) {
                  if (current.heading || current.body.length > 0) {
                    sections.push(current);
                  }
                  current = { heading: p.replace(/:$/, ''), body: [] };
                } else {
                  current.body.push(p);
                }
              }
              if (current.heading || current.body.length > 0) sections.push(current);

              // Render each body paragraph: detect "Label: text" → bold label, also bullet lines
              const renderParagraph = (para: string, key: number) => {
                const lines = para.split(/\n/).filter(Boolean);
                // If multiple short "Label: value" lines, render as bullet list
                const allLabeled = lines.length > 1 && lines.every(l => /^[A-ZÄÖÅ][^:]{1,60}:\s/.test(l.trim()));
                if (allLabeled) {
                  return (
                    <ul key={key} className="grid gap-3 sm:grid-cols-2">
                      {lines.map((line, i) => {
                        const idx = line.indexOf(':');
                        const label = line.slice(0, idx).trim();
                        const value = line.slice(idx + 1).trim();
                        return (
                          <li key={i} className="flex gap-3 rounded-md border border-border bg-background p-4 leading-relaxed shadow-sm">
                            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                            <span className="text-sm text-muted-foreground"><strong className="mb-1 block font-semibold text-navy">{label}</strong>{value}</span>
                          </li>
                        );
                      })}
                    </ul>
                  );
                }
                const labeledLines = lines.filter(line => /^([A-ZÄÖÅ][^:]{1,60}):\s+(.*)$/.test(line.trim()));
                if (labeledLines.length >= 2) {
                  return (
                    <div key={key} className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                      {lines.map((line, i) => {
                        const match = line.match(/^([A-ZÄÖÅ][^:]{1,60}):\s+(.*)$/);
                        if (!match) return <p key={i} className="sm:col-span-2 text-muted-foreground leading-relaxed">{line}</p>;
                        return (
                          <div key={i} className="border-l-2 border-gold pl-4">
                            <strong className="block text-sm font-semibold text-navy">{match[1]}</strong>
                            <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{match[2]}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                return (
                  <p key={key} className="text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                    {lines.map((line, i) => {
                      const m = line.match(/^([A-ZÄÖÅ][^:]{1,60}):\s+(.*)$/);
                      return (
                        <React.Fragment key={i}>
                          {m ? (
                            <><strong className="text-foreground font-semibold">{m[1]}:</strong> {m[2]}</>
                          ) : (
                            line
                          )}
                          {i < lines.length - 1 && <br />}
                        </React.Fragment>
                      );
                    })}
                  </p>
                );
              };

              return (
                <section className="space-y-6">
                  <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                    <span className="h-px w-12 bg-gold" aria-hidden="true" />
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-foreground">Future Homes International</p>
                  </div>
                  <h2 className="text-3xl font-semibold text-navy md:text-4xl">{t('pd.about_property', language)}</h2>
                  <div className="grid gap-5 md:grid-cols-2">
                    {sections.map((section, sIdx) => (
                      <article
                        key={sIdx}
                        className={`relative space-y-5 overflow-hidden rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6 md:p-8 ${!section.heading || sIdx === 0 ? 'md:col-span-2' : ''}`}
                      >
                        <span className="absolute right-5 top-3 font-serif text-5xl text-gold/15" aria-hidden="true">{String(sIdx + 1).padStart(2, '0')}</span>
                        {section.heading && (
                          <div className="relative pr-12">
                            <span className="mb-4 block h-0.5 w-10 bg-gold" aria-hidden="true" />
                            <h3 className="text-xl font-semibold leading-snug text-navy md:text-2xl">{section.heading}</h3>
                          </div>
                        )}
                        <div className="relative space-y-5">{section.body.map((para, pIdx) => renderParagraph(para, pIdx))}</div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })()}

            {/* Location Details */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">{t('pd.location_nearby', language)}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.distanceToAirport && <div className="flex items-center space-x-4 rounded-lg border border-border bg-card p-5">
                    <Plane className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('pd.distance_airport', language)}</p>
                      <p className="font-semibold">{property.distanceToAirport}</p>
                    </div>
                  </div>}
                {property.distanceToBeach && <div className="flex items-center space-x-4 rounded-lg border border-border bg-card p-5">
                    <Waves className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('pd.distance_beach', language)}</p>
                      <p className="font-semibold">{property.distanceToBeach}</p>
                    </div>
                  </div>}
              </div>
            </div>

            {/* Features & Amenities */}
            {property.features && property.features.length > 0 && <div className="space-y-4">
                <h2 className="text-2xl font-semibold">{t('pd.features_amenities', language)}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.features.map((feature: string, index: number) => <div key={index} className="flex items-center space-x-3 border-b border-border p-4 transition-colors hover:bg-card">
                      <CheckCircle className="h-5 w-5 text-gold flex-shrink-0" />
                      <span className="text-foreground font-medium">{translateAmenity(feature, language)}</span>
                    </div>)}
                </div>
              </div>}

            {/* Pricing Details */}
            {property.pricing && property.pricing.length > 0 && <div className="space-y-4">
                <h2 className="text-2xl font-semibold">{t('pd.available_units', language)}</h2>
                <div className="space-y-3">
                  {property.pricing.map((unit: any, index: number) => <div key={index} className="rounded-lg border border-border bg-card p-5 transition hover:border-gold/60">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="font-semibold">{unit.type} {propertyTypeLabel('apartment', language)}</h3>
                          <p className="text-sm text-muted-foreground">{unit.size}</p>
                        </div>
                        <div className="text-xl font-bold text-primary mt-2 md:mt-0">
                           {formatPriceFromString(unit.price, formatPrice)}{Number(property.buyer_fee_percent) > 0 ? ` +${property.buyer_fee_percent}%` : ''}
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>}


            {/* Project Timeline */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">{t('pd.project_timeline', language)}</h2>
              <div className="rounded-lg border border-border bg-card p-6">
                <Timeline data={getTimelineData()} location={property.location} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:col-span-4">
            {/* Quick Info Card */}
            <div className="rounded-lg bg-navy p-6 text-navy-foreground shadow-[var(--shadow-luxe)]">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold">{t('pd.quick_info', language)}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-navy-foreground/70">{t('pd.property_type', language)}:</span>
                  <span className="font-semibold">{propertyTypeLabel(property.propertyType, language)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-navy-foreground/70">{t('pd.completion', language)}:</span>
                  <span className="font-semibold">
                    {parseCompletionDate(property.buildingComplete)?.toLocaleDateString(language === 'en' ? 'en-US' : language, { month: 'short', year: 'numeric' }) || '—'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-navy-foreground/70">{t('pd.ref_no', language)}:</span>
                  <span className="font-semibold">{property.refNo || property.id}</span>
                </div>
              </div>
            </div>

            {/* Enquiry card — WhatsApp + lead form */}
            <div className="lg:sticky lg:top-24 space-y-3">
              <PropertyInquiry refNo={String(property.refNo || property.id)} title={property.title} lang={language} />
              <div className="flex items-center gap-3 border-x border-b border-border bg-card p-4">
                <Avatar className="h-11 w-11">
                  {agent?.image && <AvatarImage src={agent.image} />}
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">FH</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold notranslate" translate="no">{agent?.name || property.agent}</p>
                  <a href={`tel:${property?.contactPhone || "+905523032750"}`} className="text-xs text-primary hover:underline">
                    <Phone className="mr-1 inline h-3 w-3" />{property?.contactPhone || "+90 552 303 27 50"}
                  </a>
                </div>
                <a href={`mailto:${property?.contactEmail || "info@futurehomesinternational.com"}`} aria-label="Email" className="rounded-full p-2 text-primary hover:bg-primary/10">
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Investment Highlights */}
            <div className="border-y border-gold/35 bg-transparent py-6">
              <h3 className="mb-4 text-lg font-semibold">{t('pd.investment_highlights', language)}</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 border-b border-border p-3">
                  <div className="w-9 h-9 bg-navy rounded-lg flex items-center justify-center">
                    <Star className="h-4 w-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t('pd.prime_location', language)}</p>
                    <p className="text-xs text-muted-foreground">{t('pd.high_growth_area', language)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 border-b border-border p-3">
                  <div className="w-9 h-9 bg-navy rounded-lg flex items-center justify-center">
                    <Award className="h-4 w-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t('pd.quality_construction', language)}</p>
                    <p className="text-xs text-muted-foreground">{t('pd.international_standards', language)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3">
                  <div className="w-9 h-9 bg-navy rounded-lg flex items-center justify-center">
                    <Home className="h-4 w-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t('pd.modern_amenities', language)}</p>
                    <p className="text-xs text-muted-foreground">{t('pd.full_facilities', language)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Properties */}
            <div className="rounded-lg border border-border bg-card p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">{t('pd.similar_properties', language)}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('pd.discover_more_in', language)} {property.location}
              </p>
              <Link to={localizePath(getLocationRoute(property.location), getLocaleFromPathname(location.pathname))}>
                <Button size="sm" className="w-full bg-navy text-navy-foreground hover:bg-navy/90">
                  {t('pd.view_similar_properties', language)}
                </Button>
              </Link>
            </div>
          </aside>
        </div>

        <div className="mx-auto mt-16 max-w-7xl sm:mt-20">
          <PropertyAreaInsights property={property} lang={language} />
        </div>

        <SEOInternalLinks />
        <PropertyStickyCta
          refNo={String(refLabel)}
          title={property.title}
          lang={language}
          price={property.price ? formatPriceFromString(property.price, formatPrice) : t('home.price_on_request', language)}
        />
      </div>
    </div>;
};
export default PropertyDetail;