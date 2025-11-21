import React from 'react';
import Navigation from '@/components/Navigation';
import { EnhancedSEOHead } from '@/components/EnhancedSEOHead';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';
import FAQSchema from '@/components/FAQSchema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, MapPin, Star, Waves, Car, Wifi, TreePine } from 'lucide-react';
import { Link } from 'react-router-dom';

const LuxuryVillasInTurkey = () => {
  const faqItems = [
    {
      question: "What makes Turkish villas luxury properties?",
      answer: "Luxury villas in Turkey feature private pools, sea or mountain views, premium finishes, large gardens, and high-end amenities like smart home systems, underfloor heating, and designer kitchens."
    },
    {
      question: "What are the price ranges for luxury villas in Turkey?",
      answer: "Luxury villa prices range from €200,000 for smaller properties to €2,000,000+ for ultra-luxury beachfront villas. Location, size, and amenities significantly impact pricing."
    },
    {
      question: "Are villas good investments in Turkey?",
      answer: "Yes, luxury villas often appreciate well and can generate 5-7% rental yields. They're popular with high-end tourists and long-term renters seeking privacy and luxury."
    },
    {
      question: "What villa locations are most popular in Turkey?",
      answer: "Popular villa locations include Kalkan, Kas, Bodrum, Antalya's Konyaaltı, Alanya's premium areas, and Istanbul's Bosphorus region for their stunning views and exclusivity."
    }
  ];

  const villaTypes = [
    {
      type: "Beachfront Villas",
      bedrooms: "3-6 Bedrooms",
      size: "200-500 m²",
      priceRange: "€400,000 - €2,000,000",
      description: "Direct beach access with stunning sea views",
      features: ["Private beach access", "Sea views", "Large terraces", "Premium location"]
    },
    {
      type: "Hillside Villas",
      bedrooms: "4-5 Bedrooms",
      size: "250-400 m²",
      priceRange: "€250,000 - €800,000",
      description: "Panoramic views with privacy and tranquility",
      features: ["Mountain/sea views", "Large gardens", "Privacy", "Infinity pools"]
    },
    {
      type: "Modern Villas",
      bedrooms: "3-5 Bedrooms",
      size: "200-350 m²",
      priceRange: "€200,000 - €600,000",
      description: "Contemporary design with smart home features",
      features: ["Smart home tech", "Modern design", "Energy efficient", "Open plan living"]
    },
    {
      type: "Traditional Villas",
      bedrooms: "4-6 Bedrooms",
      size: "300-600 m²",
      priceRange: "€300,000 - €1,200,000",
      description: "Authentic Turkish architecture with modern comforts",
      features: ["Traditional design", "Stone construction", "Large courtyards", "Character features"]
    }
  ];

  const locations = [
    {
      city: "Antalya",
      villas: "200+",
      priceRange: "€250,000 - €1,500,000",
      highlights: ["Konyaaltı Beach", "Lara luxury", "Golf courses", "Marina proximity"],
      description: "Turkey's premier villa destination with year-round appeal"
    },
    {
      city: "Kalkan",
      villas: "80+",
      priceRange: "€300,000 - €2,000,000",
      highlights: ["Exclusive location", "Boutique atmosphere", "Sea views", "High-end market"],
      description: "Sophisticated resort town with premium villa market"
    },
    {
      city: "Alanya",
      villas: "150+",
      priceRange: "€200,000 - €800,000",
      highlights: ["Castle views", "Penthouse villas", "Expat community", "Beach proximity"],
      description: "Popular expat destination with diverse villa options"
    }
  ];

  const luxuryFeatures = [
    { icon: Waves, name: "Private Pool", description: "Infinity or standard pools with heating" },
    { icon: Car, name: "Private Parking", description: "Covered parking for multiple vehicles" },
    { icon: TreePine, name: "Landscaped Gardens", description: "Professional landscaping and irrigation" },
    { icon: Wifi, name: "Smart Home Tech", description: "Automation, security, and climate control" }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Luxury Villas in Turkey",
    "description": "Exclusive luxury villas for sale in Turkey. Private pools, sea views, modern designs. Prime locations in Antalya, Alanya & coastal regions.",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://futurehomesturkey.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Property for Sale in Turkey",
          "item": "https://futurehomesturkey.com/property-for-sale-in-turkey"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Luxury Villas in Turkey"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEOHead
        title="Luxury Villas | Premium Villa Collection"
        description="Exclusive luxury villas for sale. Private pools, sea views, modern designs. Prime coastal locations with investment opportunities."
        keywords={['Luxury villas', 'Villas for sale', 'Villa with sea view', 'Private pool villas', 'Beachfront villas']}
        canonical="https://futurehomesturkey.com/luxury-villas"
        structuredData={structuredData}
      />
      
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <BreadcrumbNavigation 
          items={[
            { name: 'Property for Sale in Turkey', url: '/property-for-sale-in-turkey' },
            { name: 'Luxury Villas in Turkey', url: '/luxury-villas-in-turkey' }
          ]}
        />

        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Luxury Villas in Turkey
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover exclusive luxury villas for sale in Turkey's most prestigious locations. From stunning beachfront properties to secluded hillside retreats, each villa offers privacy, luxury, and breathtaking views.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/properties?type=villa">View All Villas</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Schedule Villa Tour</Link>
            </Button>
          </div>
        </section>

        {/* Villa Types */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Villa Categories & Pricing</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {villaTypes.map((villa, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{villa.type}</CardTitle>
                    <Badge variant="secondary">{villa.bedrooms}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{villa.size}</p>
                  <p className="text-lg font-semibold text-primary">{villa.priceRange}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{villa.description}</p>
                  <ul className="space-y-1 text-sm">
                    {villa.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <Star className="w-3 h-3 text-primary mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Premium Locations */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Premium Villa Locations</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {locations.map((location, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 text-primary mr-2" />
                      {location.city}
                    </CardTitle>
                    <Badge>{location.villas}</Badge>
                  </div>
                  <p className="text-lg font-semibold text-primary">{location.priceRange}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{location.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium">Premium Areas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {location.highlights.map((area, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button asChild className="w-full mt-4">
                    <Link to={`/${location.city.toLowerCase()}`}>View {location.city} Villas</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Luxury Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Standard Luxury Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {luxuryFeatures.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-lg">{feature.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Investment Insights */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Villa Investment Benefits</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Home className="h-6 w-6 text-primary mr-2" />
                    Rental Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Luxury Villa Weekly Rental:</span>
                      <span className="font-semibold">€1,500 - €8,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual Yield Potential:</span>
                      <span className="font-semibold">5-7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Peak Season Occupancy:</span>
                      <span className="font-semibold">80-95%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Capital Appreciation:</span>
                      <span className="font-semibold">3-8% annually</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Why Choose Turkish Villas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Star className="w-4 h-4 text-primary mr-3 mt-1" />
                      <span>Exclusive privacy and luxury lifestyle</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="w-4 h-4 text-primary mr-3 mt-1" />
                      <span>High-end rental market with premium rates</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="w-4 h-4 text-primary mr-3 mt-1" />
                      <span>Strong capital appreciation in prime locations</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="w-4 h-4 text-primary mr-3 mt-1" />
                      <span>Turkish citizenship eligibility with €400k+ investment</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="w-4 h-4 text-primary mr-3 mt-1" />
                      <span>Professional villa management services available</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-6">Discover Your Dream Villa in Turkey</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore our exclusive collection of luxury villas in Turkey's most prestigious locations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/properties?type=villa">Browse Luxury Villas</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Schedule Private Tour</Link>
            </Button>
          </div>
        </section>
      </main>

      <FAQSchema faqItems={faqItems} />
    </div>
  );
};

export default LuxuryVillasInTurkey;