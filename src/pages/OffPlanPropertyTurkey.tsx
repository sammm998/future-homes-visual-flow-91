import React from 'react';
import Navigation from '@/components/Navigation';
import { EnhancedSEOHead } from '@/components/EnhancedSEOHead';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';
import FAQSchema from '@/components/FAQSchema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Calendar, TrendingDown, Shield, Euro, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const OffPlanPropertyTurkey = () => {
  const faqItems = [
    {
      question: "What is off-plan property investment?",
      answer: "Off-plan property investment involves purchasing property before or during construction. Buyers typically pay in installments during the construction period and receive the finished property upon completion."
    },
    {
      question: "What are the benefits of buying off-plan in Turkey?",
      answer: "Benefits include 10-20% discounts from market value, flexible payment plans, choice of best units, modern designs, and potential capital appreciation during construction."
    },
    {
      question: "Is off-plan property investment safe in Turkey?",
      answer: "Yes, when working with reputable developers. Turkish law requires developers to provide completion guarantees and construction insurance. Always verify developer credentials and project permits."
    },
    {
      question: "How do payment plans work for off-plan properties?",
      answer: "Typical payment plans include 30-50% during construction in installments, with the balance paid upon completion. Some developers offer interest-free payment terms."
    }
  ];

  const benefits = [
    {
      title: "Significant Discounts",
      description: "Save 10-20% compared to completed properties",
      icon: TrendingDown,
      details: ["Early bird pricing", "Developer incentives", "Pre-market rates", "Volume discounts"]
    },
    {
      title: "Flexible Payment Plans",
      description: "Spread payments throughout construction period",
      icon: Calendar,
      details: ["Interest-free options", "Construction-linked payments", "Low initial deposit", "Customizable terms"]
    },
    {
      title: "Modern Specifications",
      description: "Latest designs and technology included",
      icon: Building,
      details: ["Smart home features", "Energy efficiency", "Modern amenities", "Quality materials"]
    },
    {
      title: "Capital Appreciation",
      description: "Property value growth during construction",
      icon: Euro,
      details: ["Market value increase", "Completion premium", "Area development", "Infrastructure improvements"]
    }
  ];

  const projectTypes = [
    {
      type: "Residential Complexes",
      timeframe: "18-24 months",
      priceRange: "€65,000 - €300,000",
      features: ["Swimming pools", "Fitness centers", "24/7 security", "Landscaped gardens"],
      description: "Modern apartment complexes with full amenities"
    },
    {
      type: "Villa Communities",
      timeframe: "24-36 months",
      priceRange: "€200,000 - €800,000",
      features: ["Private pools", "Gated community", "Golf courses", "Beach access"],
      description: "Exclusive villa developments in prime locations"
    },
    {
      type: "Mixed-Use Developments",
      timeframe: "36-48 months",
      priceRange: "€85,000 - €500,000",
      features: ["Retail spaces", "Offices", "Hotels", "Entertainment"],
      description: "Comprehensive developments with multiple functions"
    }
  ];

  const timeline = [
    {
      phase: "Reservation",
      duration: "1-7 days",
      payment: "5-10% deposit",
      description: "Secure your preferred unit with initial deposit"
    },
    {
      phase: "Contract Signing",
      duration: "2-4 weeks",
      payment: "20-30% down payment",
      description: "Legal documentation and official agreement"
    },
    {
      phase: "Construction Period",
      duration: "12-36 months",
      payment: "40-60% in installments",
      description: "Regular payments linked to construction milestones"
    },
    {
      phase: "Completion",
      duration: "Handover",
      payment: "Final 10-20%",
      description: "Property inspection and key handover"
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Off-Plan Property Turkey",
    "description": "Discover off-plan properties in Turkey with 10-20% discounts, flexible payment plans, and modern specifications. Investment opportunities in Antalya, Alanya & more.",
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
          "name": "Off-Plan Property Turkey"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEOHead
        title="Off-Plan Property Turkey | Pre-Construction Investment"
        description="Discover off-plan properties in Turkey with 10-20% discounts, flexible payment plans, and modern specifications. Investment opportunities in Antalya, Alanya & more."
        keywords={['Off-plan property Turkey', 'Pre-construction Turkey', 'Turkey property investment', 'New developments Turkey', 'Construction phase property']}
        canonical="https://futurehomesturkey.com/off-plan-property-turkey"
        structuredData={structuredData}
      />
      
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <BreadcrumbNavigation 
          items={[
            { name: 'Property for Sale in Turkey', url: '/property-for-sale-in-turkey' },
            { name: 'Off-Plan Property Turkey', url: '/off-plan-property-turkey' }
          ]}
        />

        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Off-Plan Property in Turkey
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Secure your dream property at today's prices with our exclusive off-plan developments. Enjoy significant discounts, flexible payment plans, and the latest in modern design and technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/properties?status=off-plan">View Off-Plan Projects</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Get Investment Guide</Link>
            </Button>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Off-Plan Investment?</h2>
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

        {/* Project Types */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Available Project Types</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {projectTypes.map((project, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{project.type}</span>
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      {project.timeframe}
                    </Badge>
                  </CardTitle>
                  <p className="text-lg font-semibold text-primary">{project.priceRange}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium">Included Features:</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {project.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Purchase Timeline */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Off-Plan Purchase Process</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {timeline.map((step, index) => (
                <Card key={index} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-primary text-primary-foreground">
                        Step {index + 1}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{step.duration}</span>
                    </div>
                    <CardTitle className="text-lg">{step.phase}</CardTitle>
                    <p className="text-lg font-semibold text-primary">{step.payment}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </CardContent>
                  {index < timeline.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-primary/20"></div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Risk Management */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Safety & Risk Management</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-6 w-6 text-primary mr-2" />
                    Legal Protections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></span>
                      <span>Construction completion guarantees required by law</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></span>
                      <span>Mandatory construction insurance coverage</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></span>
                      <span>Government building permits and approvals</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></span>
                      <span>Escrow account protection for payments</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Our Due Diligence Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></span>
                      <span>Comprehensive developer background checks</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></span>
                      <span>Verification of all permits and licenses</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></span>
                      <span>Financial stability assessment of projects</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></span>
                      <span>Regular construction progress monitoring</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Investment Comparison */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Off-Plan vs Ready Property Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-4 text-left">Aspect</th>
                    <th className="border border-border p-4 text-center">Off-Plan Property</th>
                    <th className="border border-border p-4 text-center">Ready Property</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-4 font-medium">Purchase Price</td>
                    <td className="border border-border p-4 text-center text-green-600">10-20% Lower</td>
                    <td className="border border-border p-4 text-center">Market Price</td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td className="border border-border p-4 font-medium">Payment Terms</td>
                    <td className="border border-border p-4 text-center text-green-600">Flexible Installments</td>
                    <td className="border border-border p-4 text-center">Lump Sum</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-4 font-medium">Immediate Use</td>
                    <td className="border border-border p-4 text-center text-red-600">Not Available</td>
                    <td className="border border-border p-4 text-center text-green-600">Immediate</td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td className="border border-border p-4 font-medium">Rental Income</td>
                    <td className="border border-border p-4 text-center text-red-600">After Completion</td>
                    <td className="border border-border p-4 text-center text-green-600">Immediate</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-4 font-medium">Customization</td>
                    <td className="border border-border p-4 text-center text-green-600">Often Available</td>
                    <td className="border border-border p-4 text-center text-red-600">Limited</td>
                  </tr>
                </tbody>
              </table>
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
          <h2 className="text-3xl font-bold mb-6">Start Your Off-Plan Investment Journey</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Secure your future property at today's prices with our carefully selected off-plan developments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/properties?status=off-plan">Browse Off-Plan Projects</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Get Investment Consultation</Link>
            </Button>
          </div>
        </section>
      </main>

      <FAQSchema faqItems={faqItems} />
    </div>
  );
};

export default OffPlanPropertyTurkey;