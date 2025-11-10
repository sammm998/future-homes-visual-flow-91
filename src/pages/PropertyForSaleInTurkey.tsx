import React from 'react';
import Navigation from '@/components/Navigation';
import { EnhancedSEOHead } from '@/components/EnhancedSEOHead';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';
import FAQSchema from '@/components/FAQSchema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Home, TrendingUp, Shield, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const PropertyForSaleInTurkey = () => {
  const faqItems = [
    {
      question: "Can foreigners buy property in Turkey?",
      answer: "Yes, foreigners can buy freehold property in Turkey under current laws. There are some restrictions on certain border areas and military zones, but most residential and commercial properties are available for foreign ownership."
    },
    {
      question: "What are the property purchase taxes in Turkey?",
      answer: "Property purchase taxes in Turkey include approximately 4% title deed tax, plus notary fees, valuation costs, and legal fees. The total additional costs typically range from 5-7% of the property value."
    },
    {
      question: "Is Turkish citizenship available through property investment?",
      answer: "Yes, Turkey offers citizenship through property investment. You need to purchase property worth at least $400,000 and hold it for a minimum of 3 years. The process typically takes 3-6 months."
    },
    {
      question: "What are the best areas to buy property in Turkey?",
      answer: "Popular areas include Antalya (beaches and tourism), Istanbul (business hub), Alanya (retirement and investment), Bodrum (luxury and lifestyle), and Mersin (emerging market with good value)."
    },
    {
      question: "What is the average ROI for rental properties in Turkey?",
      answer: "Rental yields in Turkey typically range from 5-8% annually, depending on location and property type. Tourist areas like Antalya and Alanya often provide higher yields during peak seasons."
    }
  ];

  const propertyTypes = [
    {
      title: "Luxury Apartments",
      description: "Modern apartments with sea views and premium amenities",
      icon: Home,
      link: "/apartments-for-sale-in-turkey",
      priceRange: "€85,000 - €500,000"
    },
    {
      title: "Premium Villas",
      description: "Private villas with pools and gardens",
      icon: Star,
      link: "/luxury-villas-in-turkey",
      priceRange: "€200,000 - €2,000,000"
    },
    {
      title: "Investment Properties",
      description: "High-yield rental properties and off-plan developments",
      icon: TrendingUp,
      link: "/off-plan-property-turkey",
      priceRange: "€65,000 - €300,000"
    }
  ];

  const locations = [
    {
      name: "Antalya",
      description: "Turkey's tourism capital with beautiful beaches",
      properties: "500+ properties",
      link: "/antalya"
    },
    {
      name: "Alanya",
      description: "Popular expat destination with great weather",
      properties: "300+ properties",
      link: "/alanya"
    },
    {
      name: "Mersin",
      description: "Emerging market with excellent value",
      properties: "200+ properties",
      link: "/mersin"
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Property for Sale in Turkey",
    "description": "Discover premium properties for sale in Turkey. Luxury villas, apartments & investment opportunities in Antalya, Alanya, Mersin. Expert guidance included.",
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
          "name": "Property for Sale in Turkey"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEOHead
        title="Property for Sale in Turkey | Buy Turkish Real Estate | Future Homes International"
        description="Buy property in Turkey with expert guidance. Premium villas, apartments & investment opportunities in Antalya, Alanya, Mersin. Turkish citizenship available through $400k+ investment."
        keywords={['property for sale Turkey', 'buy property in Turkey', 'Turkish real estate', 'houses for sale Turkey', 'investment property Turkey', 'Turkey citizenship property', 'Antalya property', 'Turkish apartments']}
        canonical="https://futurehomesinternational.com/property-for-sale-in-turkey"
        structuredData={structuredData}
      />
      
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <BreadcrumbNavigation 
          items={[
            { name: 'Property for Sale in Turkey', url: '/property-for-sale-in-turkey' }
          ]}
        />

        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Property for Sale in Turkey
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover premium properties for sale in Turkey's most desirable locations. From luxury beachfront villas to modern city apartments, find your perfect Turkish property with expert guidance and comprehensive support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/properties">View All Properties</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Get Expert Advice</Link>
            </Button>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Buy Property in Turkey?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Secure Investment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Turkey offers stable property laws for foreign investors with clear ownership rights and legal protection.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <CardTitle>High ROI Potential</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Average rental yields of 5-8% annually with strong capital appreciation in prime tourist areas.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Citizenship Path</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Qualify for Turkish citizenship with property investment of $400,000+ held for 3 years.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Property Types */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Property Types Available</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {propertyTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <type.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{type.title}</CardTitle>
                  <p className="text-sm text-primary font-medium">{type.priceRange}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{type.description}</p>
                  <Button asChild className="w-full">
                    <Link to={type.link}>Explore {type.title}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Popular Locations */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Locations</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {locations.map((location, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <MapPin className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>{location.name}</CardTitle>
                  <p className="text-sm text-primary">{location.properties}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{location.description}</p>
                  <Button asChild className="w-full">
                    <Link to={location.link}>View {location.name} Properties</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Buying Process */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Property Buying Process for Foreigners</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold">1</div>
                  <div>
                    <h3 className="font-semibold mb-2">Property Selection</h3>
                    <p className="text-muted-foreground">Browse our portfolio and select properties that match your criteria and budget.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold">2</div>
                  <div>
                    <h3 className="font-semibold mb-2">Legal Documentation</h3>
                    <p className="text-muted-foreground">We handle all legal paperwork including title deed checks and contract preparation.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold">3</div>
                  <div>
                    <h3 className="font-semibold mb-2">Payment & Transfer</h3>
                    <p className="text-muted-foreground">Secure payment processing and official property transfer at the land registry office.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">What's Included:</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Free property consultation</li>
                    <li>• Legal due diligence</li>
                    <li>• Translation services</li>
                    <li>• Bank account opening assistance</li>
                    <li>• Property management services</li>
                    <li>• After-sales support</li>
                  </ul>
                </div>
              </div>
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
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get expert guidance from our experienced team and discover the perfect property investment opportunity in Turkey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/properties">Browse Properties</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Contact Expert</Link>
            </Button>
          </div>
        </section>
      </main>

      <FAQSchema faqItems={faqItems} />
    </div>
  );
};

export default PropertyForSaleInTurkey;