import React from 'react';
import Navigation from '@/components/Navigation';
import { EnhancedSEOHead } from '@/components/EnhancedSEOHead';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';
import FAQSchema from '@/components/FAQSchema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Globe, Clock, Euro, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const TurkishCitizenshipByInvestment = () => {
  const faqItems = [
    {
      question: "What is the minimum investment required for Turkish citizenship?",
      answer: "The minimum real estate investment for Turkish citizenship is $400,000 USD. The property must be held for a minimum period of 3 years and cannot be sold during this time."
    },
    {
      question: "How long does the Turkish citizenship process take?",
      answer: "The citizenship process typically takes 3-6 months from the time of application submission, provided all documents are complete and requirements are met."
    },
    {
      question: "Can family members be included in the citizenship application?",
      answer: "Yes, the main applicant's spouse and children under 18 can be included in the citizenship application at no additional investment cost."
    },
    {
      question: "What are the benefits of Turkish citizenship?",
      answer: "Turkish citizenship provides visa-free travel to 110+ countries, EU membership candidacy benefits, healthcare access, education opportunities, and the right to live and work in Turkey."
    },
    {
      question: "Are there any residency requirements for Turkish citizenship?",
      answer: "No, there are no physical residency requirements. You don't need to live in Turkey before, during, or after the citizenship process."
    }
  ];

  const benefits = [
    {
      title: "Visa-Free Travel",
      description: "Access to 110+ countries without visa requirements",
      icon: Globe,
      details: ["EU Schengen Area", "Asian countries", "South America", "Many Caribbean nations"]
    },
    {
      title: "EU Candidacy Benefits",
      description: "Turkey's EU membership negotiations provide future opportunities",
      icon: Shield,
      details: ["Potential EU citizenship", "Business opportunities", "Education access", "Healthcare benefits"]
    },
    {
      title: "Family Inclusion",
      description: "Spouse and children under 18 included at no extra cost",
      icon: Users,
      details: ["No additional investment", "Same citizenship rights", "Education benefits", "Healthcare access"]
    },
    {
      title: "Fast Processing",
      description: "Quick 3-6 month processing time with professional support",
      icon: Clock,
      details: ["Expedited process", "Expert guidance", "Document support", "Application tracking"]
    }
  ];

  const requirements = [
    {
      category: "Investment Requirements",
      items: [
        "Minimum $400,000 USD real estate investment",
        "Property must be held for 3 years minimum",
        "Investment can be in multiple properties",
        "Property must be purchased from approved developers"
      ]
    },
    {
      category: "Documentation Requirements",
      items: [
        "Valid passport and birth certificate",
        "Marriage certificate (if applicable)",
        "Children's birth certificates (if applicable)",
        "Clean criminal record certificate",
        "Health insurance coverage",
        "Proof of investment and property ownership"
      ]
    },
    {
      category: "Application Process",
      items: [
        "Property purchase and title deed registration",
        "Obtain tax number and residence permit",
        "Submit citizenship application with required documents",
        "Biometric data collection and interview",
        "Background checks and due diligence",
        "Citizenship certificate and passport issuance"
      ]
    }
  ];

  const timeline = [
    {
      phase: "Property Selection & Purchase",
      duration: "2-4 weeks",
      description: "Choose qualifying properties and complete purchase process"
    },
    {
      phase: "Document Preparation",
      duration: "4-6 weeks",
      description: "Gather and authenticate all required documents"
    },
    {
      phase: "Application Submission",
      duration: "1-2 weeks",
      description: "Submit complete application package to authorities"
    },
    {
      phase: "Processing & Approval",
      duration: "3-4 months",
      description: "Government review, background checks, and final approval"
    },
    {
      phase: "Citizenship Certificate",
      duration: "2-3 weeks",
      description: "Receive citizenship certificate and apply for Turkish passport"
    }
  ];

  const investmentOptions = [
    {
      type: "Residential Properties",
      investment: "$400,000+",
      examples: ["Luxury apartments", "Villas with sea view", "City center properties"],
      pros: ["Rental income potential", "Capital appreciation", "Personal use option"],
      locations: ["Antalya", "Istanbul", "Alanya", "Bodrum"]
    },
    {
      type: "Commercial Properties",
      investment: "$400,000+",
      examples: ["Office buildings", "Retail spaces", "Hotel units"],
      pros: ["Higher rental yields", "Business opportunities", "Portfolio diversification"],
      locations: ["Istanbul", "Ankara", "Izmir", "Antalya"]
    },
    {
      type: "Mixed Developments",
      investment: "$400,000+",
      examples: ["Mixed-use complexes", "Tourism projects", "Residential complexes"],
      pros: ["Diversified income", "Modern amenities", "Professional management"],
      locations: ["Antalya", "Alanya", "Mersin", "Bodrum"]
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Turkish Citizenship by Investment",
    "description": "Obtain Turkish citizenship through real estate investment. $400K minimum investment, 3-6 month process, visa-free travel to 110+ countries. Expert guidance included.",
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
          "name": "Turkish Citizenship by Investment"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEOHead
        title="Turkish Citizenship by Investment | $400K Real Estate Program"
        description="Obtain Turkish citizenship through real estate investment. $400K minimum investment, 3-6 month process, visa-free travel to 110+ countries. Expert guidance included."
        keywords={['Turkish citizenship by investment', 'Turkey citizenship program', 'Real estate citizenship Turkey', 'Turkish passport investment', 'Citizenship by property investment']}
        canonical="https://futurehomesturkey.com/turkish-citizenship-by-investment"
        structuredData={structuredData}
      />
      
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <BreadcrumbNavigation 
          items={[
            { name: 'Turkish Citizenship by Investment', url: '/turkish-citizenship-by-investment' }
          ]}
        />

        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Turkish Citizenship by Investment
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Secure Turkish citizenship and a second passport through real estate investment. With a minimum investment of $400,000, enjoy visa-free travel to 110+ countries and exclusive benefits for you and your family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/properties?citizenship-eligible=true">View Eligible Properties</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Get Citizenship Consultation</Link>
            </Button>
          </div>
        </section>

        {/* Key Statistics */}
        <section className="mb-16">
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Euro className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-2xl">$400,000</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Minimum Investment</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-2xl">3-6 Months</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Processing Time</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Globe className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-2xl">110+</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Visa-Free Countries</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-2xl">Family</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Spouse & Kids Included</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Citizenship Benefits</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <benefit.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{benefit.description}</p>
                  <ul className="space-y-1 text-sm">
                    {benefit.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Investment Options */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Investment Options</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {investmentOptions.map((option, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{option.type}</CardTitle>
                    <Badge variant="secondary">{option.investment}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Examples:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {option.examples.map((example, idx) => (
                          <li key={idx}>• {example}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Advantages:</h4>
                      <ul className="space-y-1 text-sm text-green-600">
                        {option.pros.map((pro, idx) => (
                          <li key={idx}>• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Top Locations:</h4>
                      <div className="flex flex-wrap gap-1">
                        {option.locations.map((location, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Requirements */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Requirements & Process</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {requirements.map((req, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 text-primary mr-2" />
                    {req.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {req.items.map((item, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Application Timeline</h2>
            <div className="space-y-6">
              {timeline.map((step, index) => (
                <Card key={index} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold mr-4">
                          {index + 1}
                        </div>
                        <CardTitle className="text-lg">{step.phase}</CardTitle>
                      </div>
                      <Badge variant="outline">{step.duration}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground ml-12">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Cost Breakdown */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Investment Cost Breakdown</h2>
            <Card>
              <CardHeader>
                <CardTitle>Total Investment Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Property Investment (minimum)</span>
                    <span className="text-xl font-bold text-primary">$400,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Legal & Documentation Fees</span>
                    <span>$5,000 - $8,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Translation & Authentication</span>
                    <span>$1,000 - $2,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Government Application Fees</span>
                    <span>$1,500 - $2,500</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Property Transfer Costs (4% tax)</span>
                    <span>$16,000+</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t font-bold">
                    <span>Total Estimated Investment</span>
                    <span className="text-xl text-primary">$423,500 - $428,500</span>
                  </div>
                </div>
              </CardContent>
            </Card>
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
          <h2 className="text-3xl font-bold mb-6">Start Your Turkish Citizenship Journey</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get expert guidance through every step of the Turkish citizenship by investment process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/properties?citizenship-eligible=true">View Eligible Properties</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Book Consultation</Link>
            </Button>
          </div>
        </section>
      </main>

      <FAQSchema faqItems={faqItems} />
    </div>
  );
};

export default TurkishCitizenshipByInvestment;