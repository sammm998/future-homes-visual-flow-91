
import React, { useState, useMemo, useEffect } from 'react';
import ElevenLabsWidget from "@/components/ElevenLabsWidget";
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import PropertyFilter from "@/components/PropertyFilter";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Timeline } from "@/components/ui/timeline";
import { Eye, Grid } from "lucide-react";
import { filterProperties, PropertyFilters } from "@/utils/propertyFilter";
import SEOHead from "@/components/SEOHead";

const CyprusPropertySearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [filters, setFilters] = useState<PropertyFilters>({
    propertyType: '',
    bedrooms: '',
    location: 'Cyprus',
    district: '',
    minPrice: '',
    maxPrice: '',
    minSquareFeet: '',
    maxSquareFeet: '',
    facilities: [],
    sortBy: 'ref',
    referenceNo: ''
  });
  const [showFiltered, setShowFiltered] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  
  // Load filters from URL parameters and location state on mount
  useEffect(() => {
    const urlFilters: PropertyFilters = {
      propertyType: searchParams.get('propertyType') || '',
      bedrooms: searchParams.get('bedrooms') || '',
      location: searchParams.get('location') || 'Cyprus',
      district: searchParams.get('district') || '',
      minPrice: searchParams.get('priceMin') || searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('priceMax') || searchParams.get('maxPrice') || '',
      minSquareFeet: searchParams.get('areaMin') || searchParams.get('minSquareFeet') || '',
      maxSquareFeet: searchParams.get('areaMax') || searchParams.get('maxSquareFeet') || '',
      facilities: searchParams.get('facilities')?.split(',').filter(Boolean) || [],
      sortBy: (searchParams.get('sortBy') as any) || 'ref',
      referenceNo: searchParams.get('referenceNumber') || searchParams.get('referenceNo') || ''
    };

    // Merge with location state if available
    const stateFilters = location.state?.filters;
    if (stateFilters) {
      Object.keys(stateFilters).forEach(key => {
        if (stateFilters[key] && stateFilters[key] !== '') {
          urlFilters[key as keyof PropertyFilters] = stateFilters[key];
        }
      });
    }

    setFilters(urlFilters);
    
    // Show filtered results if any filters are applied
    const hasFilters = Object.entries(urlFilters).some(([key, value]) => {
      return value && value !== '' && value !== 'ref' && value !== 'Cyprus';
    });
    
    setShowFiltered(hasFilters);
  }, [searchParams, location.state]);
  

  // Get reference number for property ID (matching PropertyDetail.tsx exactly)
  const getRefNo = (id: number): string => {
    const refMap: Record<number, string> = {
      4493: "8015", 4504: "8024", 4510: "8029", 4513: "8032", 4490: "8012", 
      4489: "8011", 4482: "8005", 4491: "8013", 4500: "8021", 4509: "8028",
      4503: "8023", 4507: "8026", 4494: "8016", 4511: "8030", 4512: "8031",
      4501: "8022", 4486: "8008", 4498: "8019", 4496: "8018", 4492: "8014",
      4506: "8025", 4495: "8017", 4481: "8004", 4479: "8003", 4508: "8027",
      4515: "8033", 4483: "8006", 4484: "8007", 4488: "8010"
    };
    return refMap[id] || `${id}`;
  };

  const properties = [
    {
      id: 4493,
      refNo: getRefNo(4493),
      title: "Modern designed seaside apartments in Cyprus, Tatlısu",
      location: "Cyprus, Tatlısu",
      price: "€600,000",
      bedrooms: "2+1 <> 3+1",
      bathrooms: "2",
      area: "110 <> 140",
      status: "Sea view, For Residence Permit, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4493/general/apartment-319005.webp",
      coordinates: [35.3369, 33.3192] as [number, number]
    },
    {
      id: 4504,
      refNo: getRefNo(4504),
      title: "Luxury villas and apartments in a perfect location in Cyprus, Esentepe",
      location: "Cyprus, Esentepe", 
      price: "€420,000",
      bedrooms: "2+1 <> 3+1",
      bathrooms: "2",
      area: "89 <> 158",
      status: "Sea view, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4504/general/apartment-319208.webp",
      coordinates: [35.3370, 33.3193] as [number, number]
    },
    {
      id: 4510,
      refNo: getRefNo(4510),
      title: "Stylish loft apartments in a unique location in Cyprus, Bahçeli",
      location: "Cyprus, Bahçeli",
      price: "€175,000",
      bedrooms: "1+1",
      bathrooms: "1",
      area: "82",
      status: "Sea view, For Residence Permit, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4510/general/apartment-319302.webp",
      coordinates: [35.3371, 33.3194] as [number, number]
    },
    {
      id: 4513,
      refNo: getRefNo(4513),
      title: "Luxury apartments in the villa area near the sea in Cyprus, Esentepe",
      location: "Cyprus, Esentepe",
      price: "€215,000",
      bedrooms: "1+1 <> 3+1",
      bathrooms: "1",
      area: "46 <> 132",
      status: "Sea view, For Residence Permit, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4513/general/apartment-319371.webp",
      coordinates: [35.3372, 33.3195] as [number, number]
    },
    {
      id: 4490,
      refNo: getRefNo(4490),
      title: "Stylish apartments in a complex with a private beach in Cyprus, Famagusta",
      location: "Cyprus, Famagusta",
      price: "€552,000", 
      bedrooms: "2+1 <> 3+1",
      bathrooms: "2",
      area: "115 <> 142",
      status: "Sea view, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4490/general/apartment-318948.webp",
      coordinates: [35.1264, 33.9384] as [number, number]
    },
    {
      id: 4489,
      refNo: getRefNo(4489),
      title: "Modern designed apartments with sea view in Cyprus, Tatlısu",
      location: "Cyprus, Tatlısu",
      price: "€540,000",
      bedrooms: "3+1",
      bathrooms: "2",
      area: "135",
      status: "Sea view, For Residence Permit, Ready to Move",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4489/general/apartment-318933.webp",
      coordinates: [35.3373, 33.3196] as [number, number]
    },
    {
      id: 4482,
      refNo: getRefNo(4482),
      title: "Flats in a luxury project with a hospital in Cyprus, Gaziveren",
      location: "Cyprus, Gaziveren",
      price: "€98,000",
      bedrooms: "1+ <> 1+1",
      bathrooms: "1",
      area: "37 <> 59", 
      status: "Sea view, For Residence Permit, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4482/general/apartment-318787.webp",
      coordinates: [35.3374, 33.3197] as [number, number]
    },
    {
      id: 4491,
      refNo: getRefNo(4491),
      title: "Beachfront flats in a project with extensive facilities in Cyprus, Esentepe",
      location: "Cyprus, Esentepe",
      price: "€141,000",
      bedrooms: "1+ <> 2+1",
      bathrooms: "1 <> 2",
      area: "42 <> 88",
      status: "Sea view, For Residence Permit, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4491/general/apartment-318968.webp",
      coordinates: [35.3375, 33.3198] as [number, number]
    },
    {
      id: 4500,
      refNo: getRefNo(4500),
      title: "Apartments in a complex with indoor swimming pool in Cyprus, Tatlısu",
      location: "Cyprus, Tatlısu",
      price: "€143,000",
      bedrooms: "1+ <> 4+1",
      bathrooms: "1 <> 2",
      area: "49 <> 300",
      status: "Sea view, For Residence Permit, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4500/general/apartment-319135.webp",
      coordinates: [35.3376, 33.3199] as [number, number]
    },
    {
      id: 4509,
      refNo: getRefNo(4509),
      title: "Flats in a complex with sea view in Cyprus, Esentepe",
      location: "Cyprus, Esentepe",
      price: "€300,000",
      bedrooms: "3+1",
      bathrooms: "2",
      area: "121",
      status: "Sea view, For Residence Permit, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4509/general/apartment-319282.webp",
      coordinates: [35.3377, 33.3200] as [number, number]
    },
    {
      id: 4503,
      refNo: getRefNo(4503),
      title: "Stylish apartments surrounded by nature in Cyprus, Tatlısu",
      location: "Cyprus, Tatlısu",
      price: "€178,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 2",
      area: "60 <> 106",
      status: "Sea view, For Residence Permit, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4503/general/apartment-319181.webp",
      coordinates: [35.3378, 33.3201] as [number, number]
    },
    {
      id: 4507,
      refNo: getRefNo(4507),
      title: "Stylish properties within walking distance to the sea in Cyprus, Tatlısu",
      location: "Cyprus, Tatlısu",
      price: "€252,000",
      bedrooms: "1+1 <> 3+1",
      bathrooms: "1 <> 2",
      area: "133 <> 243",
      status: "Sea view, For Residence Permit, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4507/general/apartment-319238.webp",
      coordinates: [35.3379, 33.3202] as [number, number]
    },
    {
      id: 4494,
      refNo: getRefNo(4494),
      title: "Flats in the project with a health center in Cyprus, Tatlısu",
      location: "Cyprus, Tatlısu",
      price: "€138,000",
      bedrooms: "1+ <> 2+1",
      bathrooms: "1 <> 2",
      area: "41 <> 80",
      status: "For Residence Permit, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4494/general/apartment-319035.webp",
      coordinates: [35.3380, 33.3203] as [number, number]
    },
    {
      id: 4511,
      refNo: getRefNo(4511),
      title: "Flats in a complex with a swimming pool and close to the beach in Cyprus, Iskele",
      location: "Cyprus, Iskele",
      price: "€173,000",
      bedrooms: "1+1 <> 3+1",
      bathrooms: "1 <> 2",
      area: "65 <> 400",
      status: "Sea view, For Residence Permit, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4511/general/apartment-319321.webp",
      coordinates: [35.3381, 33.3204] as [number, number]
    },
    {
      id: 4512,
      refNo: getRefNo(4512),
      title: "Stylish apartments in a luxury complex in Cyprus, Iskele",
      location: "Cyprus, Iskele",
      price: "€160,000",
      bedrooms: "1+ <> 3+1",
      bathrooms: "1 <> 2",
      area: "46 <> 482",
      status: "Sea view, For Residence Permit, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4512/general/apartment-319356.webp",
      coordinates: [35.3382, 33.3205] as [number, number]
    },
    {
      id: 4501,
      refNo: getRefNo(4501),
      title: "Sea and nature view flats in a complex in Cyprus, Bahçeli",
      location: "Cyprus, Bahçeli",
      price: "€194,000",
      bedrooms: "1+ <> 2+1",
      bathrooms: "1 <> 1",
      area: "43 <> 135",
      status: "Sea view, For Residence Permit, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4501/general/apartment-319158.webp",
      coordinates: [35.3383, 33.3206] as [number, number]
    },
    {
      id: 4486,
      refNo: getRefNo(4486),
      title: "Luxury villas within a complex in Cyprus, Kyrenia",
      location: "Cyprus, Kyrenia",
      price: "€887,000",
      bedrooms: "4+1",
      bathrooms: "4",
      area: "440",
      status: "For Residence Permit, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4486/general/apartment-318857.webp",
      coordinates: [35.3384, 33.3207] as [number, number]
    },
    {
      id: 4498,
      refNo: getRefNo(4498),
      title: "Beachfront apartments in a luxury complex in Cyprus, Famagusta",
      location: "Cyprus, Famagusta",
      price: "€198,000",
      bedrooms: "1+ <> 2+1",
      bathrooms: "1 <> 2",
      area: "43 <> 135",
      status: "Sea view, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4498/general/apartment-319085.webp",
      coordinates: [35.1265, 33.9385] as [number, number]
    },
    {
      id: 4496,
      refNo: getRefNo(4496),
      title: "Sea view apartments and bungalows within the complex in Cyprus, Tatlısu",
      location: "Cyprus, Tatlısu",
      price: "€143,000",
      bedrooms: "1+ <> 3+1",
      bathrooms: "1 <> 2",
      area: "49 <> 285",
      status: "Sea view, For Residence Permit, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4496/general/apartment-319064.webp",
      coordinates: [35.3385, 33.3208] as [number, number]
    },
    {
      id: 4492,
      refNo: getRefNo(4492),
      title: "Luxury detached villas with sea view in Cyprus, Famagusta",
      location: "Cyprus, Famagusta",
      price: "€960,000",
      bedrooms: "4+1",
      bathrooms: "3",
      area: "195",
      status: "Sea view, For Residence Permit, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4492/general/apartment-318993.webp",
      coordinates: [35.1266, 33.9386] as [number, number]
    },
    {
      id: 4506,
      refNo: getRefNo(4506),
      title: "Real estate for sale in a site with a pool by the sea in Cyprus, Esentepe",
      location: "Cyprus, Esentepe",
      price: "€276,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 2",
      area: "50 <> 138",
      status: "Sea view, For Residence Permit, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4506/general/apartment-319233.webp",
      coordinates: [35.3386, 33.3209] as [number, number]
    },
    {
      id: 4495,
      refNo: getRefNo(4495),
      title: "Flats in the project with sea service in Cyprus, Esentepe",
      location: "Cyprus, Esentepe",
      price: "€480,000",
      bedrooms: "2+1",
      bathrooms: "2",
      area: "90",
      status: "Sea view, For Residence Permit, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4495/general/cyprus-apartment-319061.webp",
      coordinates: [35.3387, 33.3210] as [number, number]
    },
    {
      id: 4481,
      refNo: getRefNo(4481),
      title: "Sea view apartments for sale in Cyprus, Lefke",
      location: "Cyprus, Lefke",
      price: "€96,000",
      bedrooms: "1+ <> 2+1",
      bathrooms: "1 <> 1",
      area: "36 <> 81",
      status: "Sea view, For Residence Permit, Ready to Move",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4481/general/apartment-318755.webp",
      coordinates: [35.3388, 33.3211] as [number, number]
    },
    {
      id: 4479,
      refNo: getRefNo(4479),
      title: "Stylish villas in luxury complex in Cyprus, Kyrenia",
      location: "Cyprus, Kyrenia",
      price: "€390,000",
      bedrooms: "3+1",
      bathrooms: "1",
      area: "150",
      status: "Sea view, For Residence Permit, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4479/general/apartment-318735.webp",
      coordinates: [35.3389, 33.3212] as [number, number]
    },
    {
      id: 4508,
      refNo: getRefNo(4508),
      title: "Ultra luxury apartments in a project with a hotel in Cyprus, Iskele",
      location: "Cyprus, Iskele",
      price: "€181,000",
      bedrooms: "1+ <> 3+1",
      bathrooms: "1 <> 2",
      area: "44 <> 250",
      status: "Sea view, For Residence Permit, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4508/general/apartment-319262.webp",
      coordinates: [35.3390, 33.3213] as [number, number]
    },
    {
      id: 4515,
      refNo: getRefNo(4515),
      title: "Apartments in luxury complex in Cyprus, Gaziveren",
      location: "Cyprus, Gaziveren",
      price: "€97,000",
      bedrooms: "1+ <> 1+1",
      bathrooms: "1 <> 1",
      area: "55 <> 75",
      status: "Sea view, For Residence Permit, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4515/general/apartment-319412.webp",
      coordinates: [35.3391, 33.3214] as [number, number]
    },
    {
      id: 4483,
      refNo: getRefNo(4483),
      title: "Stylish apartments within walking distance to the sea in Cyprus, Gaziveren",
      location: "Cyprus, Gaziveren",
      price: "€93,000",
      bedrooms: "1+ <> 1+1",
      bathrooms: "1 <> 1",
      area: "37 <> 75",
      status: "Sea view, For Residence Permit, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4483/general/apartment-318829.webp",
      coordinates: [35.3392, 33.3215] as [number, number]
    },
    {
      id: 4484,
      refNo: getRefNo(4484),
      title: "Apartments in a luxury seafront project with a private beach in Gaziveren, Cyprus",
      location: "Cyprus, Gaziveren",
      price: "€142,000",
      bedrooms: "1+1 <> 2+1",
      bathrooms: "1 <> 1",
      area: "70 <> 229",
      status: "Sea view, For Residence Permit, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4484/general/apartment-318830.webp",
      coordinates: [35.3393, 33.3216] as [number, number]
    },
    {
      id: 4488,
      refNo: getRefNo(4488),
      title: "Luxury villas with private gardens by the sea in Cyprus, Kyrenia",
      location: "Cyprus, Kyrenia",
      price: "€649,000",
      bedrooms: "3+1",
      bathrooms: "3",
      area: "225",
      status: "Sea view, For Residence Permit, Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4488/general/apartment-318910.webp",
      coordinates: [35.3394, 33.3217] as [number, number]
    }
  ];

  const filteredProperties = useMemo(() => {
    if (showFiltered) {
      return filterProperties(properties, filters);
    }
    return properties;
  }, [properties, filters, showFiltered]);

  const handleFilterChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    // Auto-trigger filtering for sortBy and other filter changes
    setShowFiltered(true);
  };

  const handleSearch = () => {
    setShowFiltered(true);
  };

  const handlePropertyClick = (property: any) => {
    navigate(`/property/${property.id}`, { 
      state: { from: '/cyprus' }
    });
  };

  // Timeline data using ALL Cyprus properties
  const timelineData = filteredProperties.map((property, index) => ({
    title: property.title,
    content: (
      <div>
        <p className="text-foreground text-xs md:text-sm font-normal mb-4">
          Premium Cyprus property with sea views and modern amenities.
        </p>
        <div className="mb-6">
          <div className="flex gap-2 items-center text-muted-foreground text-xs md:text-sm mb-2">
            📍 {property.location}
          </div>
          <div className="flex gap-2 items-center text-muted-foreground text-xs md:text-sm mb-2">
            💰 {property.price}
          </div>
          <div className="flex gap-2 items-center text-muted-foreground text-xs md:text-sm mb-2">
            🏠 {property.bedrooms} | 📐 {property.area}m²
          </div>
          <div className="flex gap-2 items-center text-muted-foreground text-xs md:text-sm mb-2">
            ✅ {property.status}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img
            src={property.image}
            alt={`${property.title} - Image 1`}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `/lovable-uploads/000f440d-ddb1-4c1b-9202-eef1ef588a8c.png`;
            }}
          />
          <img
            src="/lovable-uploads/0d7b0c8a-f652-488b-bfca-3a11c1694220.png"
            alt="Property placeholder"
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
          />
          <img
            src="/lovable-uploads/0ecd2ba5-fc2d-42db-8052-d51cffc0b438.png"
            alt="Property placeholder"
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
          />
          <img
            src="/lovable-uploads/35d77b72-fddb-4174-b101-7f0dd0f3385d.png"
            alt="Property placeholder"
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg"
          />
        </div>
      </div>
    ),
  }));

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Cyprus Properties & EU Residency | Future Homes"
        description="Cyprus real estate investment with EU residency programs. Mediterranean luxury properties & expert consultation. Secure your future."
        keywords="Cyprus properties, Cyprus real estate, property investment Cyprus, sea view apartments Cyprus, Cyprus residence permit"
        canonicalUrl="https://futurehomesturkey.com/cyprus"
      />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Properties In Cyprus
          </h1>
          <p className="text-muted-foreground">
            {properties.length} properties found
          </p>
        </div>

        {/* Filter at top */}
        <div className="mb-6">
          <PropertyFilter 
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            horizontal={true}
          />
        </div>

        {/* Timeline Toggle */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <Switch isSelected={showTimeline} onChange={setShowTimeline}>
            <span className="text-sm text-muted-foreground">Timeline View</span>
          </Switch>
        </div>

        {/* Timeline Component - Only show when toggle is enabled */}
        {showTimeline && (
          <div className="mb-8">
            <Timeline data={timelineData} location="Cyprus" />
          </div>
        )}

        {/* Mobile Layout: One property per screen */}
        <div className="block md:hidden">
          <div className="space-y-6">
            {filteredProperties.map((property) => (
              <div key={property.id} className="cursor-pointer min-h-[60vh] flex items-center justify-center" onClick={() => handlePropertyClick(property)}>
                <div className="w-full max-w-sm mx-auto">
                  <PropertyCard property={property} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout: Properties Grid - Show when Timeline is OFF */}
        <div className="hidden md:block">
          {!showTimeline && (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProperties.map((property) => (
                <div key={property.id} className="cursor-pointer" onClick={() => handlePropertyClick(property)}>
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ElevenLabs Widget */}
      <ElevenLabsWidget />
    </div>
  );
};

export default CyprusPropertySearch;
