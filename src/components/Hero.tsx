import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, MapPin, Home, Building, Store, Filter } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";
import { useCurrency } from "@/contexts/CurrencyContext";
import { findPropertyLocationByRefNo } from "@/utils/propertyRouting";



interface HeroProps {
  backgroundImage?: string;
  title?: string;
  subtitle?: string;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle
}) => {
  
  const navigate = useNavigate();
  const { selectedCurrency, formatPrice } = useCurrency();
  const [searchType, setSearchType] = useState("Buy");
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

  // Memoized price options based on selected currency
  const priceOptions = useMemo(() => {
    const basePrices = [100000, 200000, 500000, 1000000, 2000000, 5000000];
    return basePrices.map(price => ({
      value: price.toString(),
      label: formatPrice(price)
    }));
  }, [selectedCurrency, formatPrice]);

  const handleSearch = async () => {
    // Build search parameters from form using same logic as PropertyFilter
    const searchParams = new URLSearchParams();
    
    if (propertyType) searchParams.set('propertyType', propertyType.toLowerCase());
    // Ensure studio bedroom filter is properly passed
    if (bedrooms) {
      searchParams.set('bedrooms', bedrooms);
      // For consistency with property pages that might look for both formats
      if (bedrooms === 'studio') {
        searchParams.set('bedrooms', 'studio');
      }
    }
    if (location) searchParams.set('location', location);
    if (refNo) searchParams.set('referenceNo', refNo);
    // Set pricing parameters with consistent naming for all property pages
    if (minPrice) {
      searchParams.set('minPrice', minPrice);
      searchParams.set('priceMin', minPrice); // Alternative naming for consistency
    }
    if (maxPrice) {
      searchParams.set('maxPrice', maxPrice);
      searchParams.set('priceMax', maxPrice); // Alternative naming for consistency
    }
    if (minSqFt) {
      searchParams.set('minSquareFeet', minSqFt);
      searchParams.set('areaMin', minSqFt); // Alternative naming for consistency
    }
    if (maxSqFt) {
      searchParams.set('maxSquareFeet', maxSqFt);
      searchParams.set('areaMax', maxSqFt); // Alternative naming for consistency
    }
    if (sortBy) searchParams.set('sortBy', sortBy.toLowerCase().replace(' ', '-'));
    
    // Add advanced search filters - map to both facilities and amenities
    const facilities = [];
    const amenities = [];
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
    
    // Add property status filters
    const statuses = [];
    if (forResidencePermit) statuses.push('residence-permit');
    if (readyToMove) statuses.push('ready-to-move');
    if (underConstruction) statuses.push('under-construction');
    
    if (statuses.length > 0) {
      searchParams.set('status', statuses.join(','));
    }
    
    // Navigate directly to location-specific pages with filters
    const locationRoutes: Record<string, string> = {
      'Antalya': '/antalya',
      'Dubai': '/dubai', 
      'Cyprus': '/cyprus',
      'Mersin': '/mersin'
    };
    
    // Determine route based on reference number or location
    let targetRoute = '/antalya'; // Default to Antalya
    
    if (refNo) {
      // Use the new utility function to find the correct location
      targetRoute = await findPropertyLocationByRefNo(refNo);
    } else if (location) {
      targetRoute = locationRoutes[location] || '/antalya';
    }
    
    navigate(`${targetRoute}?${searchParams.toString()}`);
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      {/* YouTube Background Video - Full coverage */}
      <div className="absolute inset-0 w-full h-full">
        <iframe
          className="absolute"
          src="https://www.youtube.com/embed/bGl6AtZ02pk?autoplay=1&mute=1&loop=1&playlist=bGl6AtZ02pk&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1"
          title="Background Video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{
            pointerEvents: 'none',
            width: 'calc(100vw + 20vh)',
            height: 'calc(100vh + 20vw)', 
            minWidth: '177.77vh', // 16:9 aspect ratio coverage
            minHeight: '56.25vw', // 16:9 aspect ratio coverage
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(1.2)',
            objectFit: 'cover'
          }}
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex flex-col h-full min-h-screen">
        {/* Content - Centered */}
        <div className="flex-1 p-4 sm:p-8 lg:p-16 relative z-10 flex flex-col justify-center items-center">
          <div className="max-w-6xl w-full text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4 sm:mb-6">
              {title || "Future Homes"}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-neutral-300 mb-8 sm:mb-12">
              {subtitle || "Your Future Real Estate Partner"}
            </p>

            {/* Search Card - Responsive Layout */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-3 sm:p-4 md:p-6 rounded-2xl max-w-5xl mx-auto">
              {/* Search Type Tabs */}
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="bg-white/10 rounded-lg p-1 inline-flex">
                  <button
                    className={`px-4 sm:px-6 py-2 rounded-md text-sm font-medium transition-all ${
                      searchType === "Buy"
                        ? "bg-white text-black"
                        : "text-white hover:bg-white/10"
                    }`}
                    onClick={() => setSearchType("Buy")}
                  >
                  Buy
                  </button>
                  <button
                    className={`px-4 sm:px-6 py-2 rounded-md text-sm font-medium transition-all ${
                      searchType === "Rent"
                        ? "bg-white text-black"
                        : "text-white hover:bg-white/10"
                    }`}
                    onClick={() => setSearchType("Rent")}
                  >
                  Rent
                  </button>
                </div>
              </div>

              {/* Main Search Filters - Mobile-first responsive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {/* Property Type */}
                <div className="lg:col-span-1">
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="h-10 sm:h-12 bg-white border-0 text-black text-sm">
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartments">
                        <div className="flex items-center gap-2">
                          <Building size={16} />
                          Apartments
                        </div>
                      </SelectItem>
                      <SelectItem value="houses">
                        <div className="flex items-center gap-2">
                          <Home size={16} />
                          Houses
                        </div>
                      </SelectItem>
                      <SelectItem value="villas">
                        <div className="flex items-center gap-2">
                          <Home size={16} />
                          Villas
                        </div>
                      </SelectItem>
                      <SelectItem value="commercial">
                        <div className="flex items-center gap-2">
                          <Store size={16} />
                          Commercial
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bedrooms */}
                <div className="lg:col-span-1">
                  <Select value={bedrooms} onValueChange={setBedrooms}>
                    <SelectTrigger className="h-10 sm:h-12 bg-white border-0 text-black text-sm">
                      <SelectValue placeholder="Bedrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="lg:col-span-1">
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="h-10 sm:h-12 bg-white border-0 text-black text-sm">
                      <SelectValue placeholder="Property Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Antalya">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          Antalya
                        </div>
                      </SelectItem>
                      <SelectItem value="Mersin">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          Mersin
                        </div>
                      </SelectItem>
                      <SelectItem value="Cyprus">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          Cyprus
                        </div>
                      </SelectItem>
                      <SelectItem value="Dubai">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          Dubai
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Ref No */}
                <div className="lg:col-span-1">
                  <Input
                  placeholder="Reference No"
                  value={refNo}
                  onChange={(e) => setRefNo(e.target.value)}
                    className="h-10 sm:h-12 bg-white border-0 text-black placeholder:text-gray-500 text-sm"
                  />
                </div>

                {/* Sort By */}
                <div className="lg:col-span-1">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-10 sm:h-12 bg-white border-0 text-black text-sm">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-low">Price Low to High</SelectItem>
                      <SelectItem value="price-high">Price High to Low</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="area-large">Area: Largest First</SelectItem>
                      <SelectItem value="area-small">Area: Smallest First</SelectItem>
                      <SelectItem value="bedrooms-most">Most Bedrooms</SelectItem>
                      <SelectItem value="bedrooms-least">Least Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                <Dialog open={showAdvanced} onOpenChange={setShowAdvanced}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto bg-white/20 border-white/30 text-white hover:bg-white/30 h-8 px-3 text-xs">
                      <Filter size={14} className="mr-1" />
                  Advanced
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl mx-4">
                    <DialogHeader>
                      <DialogTitle>Advanced Search</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Price Range */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">Price Range</Label>
                        <div className="flex gap-2">
                          <Select value={minPrice} onValueChange={setMinPrice}>
                            <SelectTrigger>
                              <SelectValue placeholder="Min. Price" />
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
                            <SelectTrigger>
                              <SelectValue placeholder="Max. Price" />
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

                      {/* Square Feet */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">Square Feet</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Min."
                            value={minSqFt}
                            onChange={(e) => setMinSqFt(e.target.value)}
                          />
                          <Input
                            placeholder="Max."
                            value={maxSqFt}
                            onChange={(e) => setMaxSqFt(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Facilities */}
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium mb-3 block">Facilities</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="pool"
                              checked={pool}
                              onCheckedChange={(checked) => setPool(checked === true)}
                            />
                            <Label htmlFor="pool">Pool</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="gym"
                              checked={gym}
                              onCheckedChange={(checked) => setGym(checked === true)}
                            />
                            <Label htmlFor="gym">Gym</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="garden"
                              checked={garden}
                              onCheckedChange={(checked) => setGarden(checked === true)}
                            />
                            <Label htmlFor="garden">Garden</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="parking"
                              checked={parking}
                              onCheckedChange={(checked) => setParking(checked === true)}
                            />
                            <Label htmlFor="parking">Parking</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="seaView"
                              checked={seaView}
                              onCheckedChange={(checked) => setSeaView(checked === true)}
                            />
                            <Label htmlFor="seaView">Sea view</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="security"
                              checked={security}
                              onCheckedChange={(checked) => setSecurity(checked === true)}
                            />
                            <Label htmlFor="security">Security</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="forResidencePermit"
                              checked={forResidencePermit}
                              onCheckedChange={(checked) => setForResidencePermit(checked === true)}
                            />
                            <Label htmlFor="forResidencePermit">For Residence Permit</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="readyToMove"
                              checked={readyToMove}
                              onCheckedChange={(checked) => setReadyToMove(checked === true)}
                            />
                            <Label htmlFor="readyToMove">Ready to Move</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="underConstruction"
                              checked={underConstruction}
                              onCheckedChange={(checked) => setUnderConstruction(checked === true)}
                            />
                            <Label htmlFor="underConstruction">Under Construction</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <Button onClick={handleSearch} className="w-full sm:w-auto">
                        <Search size={16} className="mr-2" />
                        Search
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button onClick={handleSearch} size="sm" className="w-full sm:w-auto bg-primary hover:bg-primary-glow px-4 h-8 text-xs">
                  <Search size={14} className="mr-1" />
                  Search
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
