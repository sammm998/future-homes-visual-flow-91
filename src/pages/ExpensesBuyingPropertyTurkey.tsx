import React from 'react';
import Navigation from '@/components/Navigation';
import { EnhancedSEOHead } from '@/components/EnhancedSEOHead';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';
import FAQSchema from '@/components/FAQSchema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, FileText, Home, Shield, AlertCircle, Euro, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExpensesBuyingPropertyTurkey = () => {
  const faqItems = [
    {
      question: "What is the difference between declared price and sales price in Turkey?",
      answer: "In Turkey, sellers often declare a lower official value than the actual sales price to reduce taxes. About 90% of sales declare around half the actual price. Taxes are calculated on the declared value, though this practice may be regulated in the future."
    },
    {
      question: "Who pays the 4% property purchase tax in Turkey?",
      answer: "By law, the buyer and seller each pay 2% (total 4%), but it's common practice in Turkey for the buyer to pay the full 4%. You can negotiate equal sharing during the purchase agreement stage."
    },
    {
      question: "Do I need a property appraisal when buying in Turkey?",
      answer: "A real estate appraisal is only mandatory if you're applying for Turkish citizenship through property investment. For regular purchases, it's optional but recommended for accurate valuation."
    },
    {
      question: "What ongoing costs should I expect after purchasing property in Turkey?",
      answer: "Annual costs include property tax (0.1-0.6% depending on type and location), DASK natural disaster insurance (TL 295-1,145), utilities, and maintenance fees for residential complexes."
    },
    {
      question: "Can I avoid using a lawyer when buying property in Turkey?",
      answer: "While not legally required, hiring a lawyer is highly recommended, especially for foreign buyers. Many reputable agencies like Future Homes provide free legal services as part of their comprehensive support."
    }
  ];

  const purchaseCosts = [
    {
      category: "Property Purchase Tax",
      amount: "4% of declared price",
      description: "Legal liability split 2% buyer, 2% seller (often buyer pays all 4%)",
      icon: Calculator,
      mandatory: true
    },
    {
      category: "Appraisal Fee",
      amount: "TL 5,500 - TL 19,495",
      description: "Mandatory only for citizenship applications, varies by property type",
      icon: FileText,
      mandatory: false
    },
    {
      category: "Power of Attorney",
      amount: "TL 6,500",
      description: "Notary fee if legal representation is used",
      icon: Shield,
      mandatory: false
    },
    {
      category: "Translation Fees",
      amount: "TL 2,000 - TL 3,000",
      description: "Sworn translation if parties don't speak Turkish",
      icon: FileText,
      mandatory: false
    },
    {
      category: "Cadastre Fees",
      amount: "TL 5,000 - TL 6,000",
      description: "Circulating capital and cadastre fees at deed office",
      icon: Home,
      mandatory: true
    },
    {
      category: "Real Estate Agent Fee",
      amount: "3-6% + VAT",
      description: "Often covered by seller, may pay less or no fee",
      icon: Home,
      mandatory: false
    }
  ];

  const ongoingCosts = [
    {
      type: "Property Tax (Annual)",
      residential: "0.2% metro / 0.1% non-metro",
      commercial: "0.4% metro / 0.2% non-metro",
      description: "Based on declared property value"
    },
    {
      type: "DASK Insurance (Annual)",
      residential: "TL 295 - TL 1,145",
      commercial: "TL 295 - TL 1,145",
      description: "Natural disaster insurance, mandatory for all properties"
    },
    {
      type: "Utilities Setup",
      residential: "TL 6,000 - TL 7,000",
      commercial: "TL 6,000 - TL 7,000",
      description: "New connections, TL 3,000 for transfers"
    },
    {
      type: "Internet & Phone",
      residential: "TL 250 - TL 550/month",
      commercial: "TL 250 - TL 550/month",
      description: "Monthly cost plus setup fees"
    }
  ];

  const costBreakdown = {
    propertyValue: 400000, // USD example
    taxRate: 0.04,
    additionalCosts: 8000, // USD estimated additional costs
  };

  const totalTax = costBreakdown.propertyValue * costBreakdown.taxRate;
  const totalCosts = totalTax + costBreakdown.additionalCosts;
  const percentageOfValue = ((totalCosts / costBreakdown.propertyValue) * 100).toFixed(1);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Expenses When Buying Property in Turkey - Complete Cost Guide 2024",
    "description": "Comprehensive guide to property purchase costs in Turkey. Learn about taxes, fees, legal costs, and ongoing expenses when buying Turkish real estate.",
    "author": {
      "@type": "Organization",
      "name": "Future Homes Turkey"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Future Homes Turkey",
      "logo": {
        "@type": "ImageObject",
        "url": "https://futurehomesturkey.com/images/future-homes-logo.png"
      }
    },
    "datePublished": "2024-06-28",
    "dateModified": "2024-09-22",
    "url": "https://futurehomesturkey.com/articles/expenses-buying-property-turkey"
  };

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEOHead
        title="Expenses When Buying Property in Turkey - Complete Cost Guide 2024"
        description="Comprehensive guide to property purchase costs in Turkey. Learn about taxes, fees, legal costs, and ongoing expenses when buying Turkish real estate."
        keywords={['Property buying costs Turkey', 'Turkey real estate taxes', 'Property purchase expenses Turkey', 'Turkish property fees', 'Real estate costs Turkey']}
        canonical="https://futurehomesturkey.com/articles/expenses-buying-property-turkey"
        structuredData={structuredData}
        articleData={{
          publishedTime: "2024-06-28T00:00:00Z",
          modifiedTime: "2024-09-22T00:00:00Z",
          author: "Future Homes Editorial Team",
          section: "Real Estate Guide",
          tags: ["Property Costs", "Turkey Real Estate", "Buying Guide", "Investment"]
        }}
      />
      
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <BreadcrumbNavigation 
          items={[
            { name: 'Articles', url: '/information' },
            { name: 'Expenses When Buying Property in Turkey', url: '/articles/expenses-buying-property-turkey' }
          ]}
        />

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">Property Guide</Badge>
            <Badge variant="outline">Updated June 2024</Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Expenses When Buying Property in Turkey
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mb-8">
            Complete guide to property purchase costs in Turkey. Understanding all expenses involved in buying Turkish real estate, from initial purchase taxes to ongoing annual costs.
          </p>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Last updated: June 28, 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>8 min read</span>
            </div>
          </div>
        </header>

        {/* Cost Overview */}
        <section className="mb-16">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Calculator className="h-8 w-8 text-primary mr-3" />
                Quick Cost Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">≈ {percentageOfValue}%</div>
                  <div className="text-muted-foreground">of declared property value</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">4%</div>
                  <div className="text-muted-foreground">property purchase tax</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">Lower</div>
                  <div className="text-muted-foreground">than worldwide average</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                      Important: Declared vs Sales Price
                    </h4>
                    <p className="text-amber-700 dark:text-amber-300 text-sm">
                      In Turkey, it is common practice for sellers to declare a lower official value than the actual sales price. 
                      About 90% of sales declare around half of the actual price. All taxes are calculated on the declared value.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Purchase Costs Breakdown */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Property Purchase Expenses</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {purchaseCosts.map((cost, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <cost.icon className="h-8 w-8 text-primary" />
                    <Badge variant={cost.mandatory ? "default" : "secondary"}>
                      {cost.mandatory ? "Mandatory" : "Optional"}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{cost.category}</CardTitle>
                  <p className="text-xl font-semibold text-primary">{cost.amount}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{cost.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Appraisal Fees Detail */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Property Appraisal Fees</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Appraisal Cost by Property Type</CardTitle>
              <p className="text-muted-foreground">
                Required only for Turkish citizenship applications. Prices exclude VAT.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <div>
                    <span className="font-medium">Residential Properties</span>
                    <span className="text-muted-foreground text-sm block">1 - 5,000 sqm</span>
                  </div>
                  <span className="font-semibold">TL 5,500 - TL 11,729</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b">
                  <div>
                    <span className="font-medium">Commercial Properties</span>
                    <span className="text-muted-foreground text-sm block">1 - 10,000 sqm</span>
                  </div>
                  <span className="font-semibold">TL 5,983 - TL 19,495</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b">
                  <div>
                    <span className="font-medium">Land Properties</span>
                    <span className="text-muted-foreground text-sm block">1 - 100,000 sqm</span>
                  </div>
                  <span className="font-semibold">TL 5,856 - TL 6,744</span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <div>
                    <span className="font-medium">Plot Properties</span>
                    <span className="text-muted-foreground text-sm block">1 - 25,000 sqm</span>
                  </div>
                  <span className="font-semibold">TL 7,493 - TL 11,924</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Title Deed Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Title Deed (Tapu) Process Costs</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Required Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span>Property Purchase Tax</span>
                    <span className="font-semibold">4% of declared price</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Circulating Capital Fee</span>
                    <span className="font-semibold">TL 5,000 - TL 6,000</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Power of Attorney (if used)</span>
                    <span className="font-semibold">TL 6,500</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sworn Translation</span>
                    <span className="font-semibold">TL 2,000</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Passport Translation</span>
                    <span className="font-semibold">TL 1,000</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Responsibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Legal Split</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Buyer: 2% of declared price</li>
                      <li>• Seller: 2% of declared price</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Common Practice</h4>
                    <p className="text-sm">
                      Buyer often pays the full 4%. You can negotiate equal sharing 
                      during purchase agreement negotiations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Annual Ongoing Costs */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Annual & Ongoing Costs</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border rounded-lg">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-4 text-left">Cost Type</th>
                  <th className="border border-border p-4 text-center">Residential</th>
                  <th className="border border-border p-4 text-center">Commercial</th>
                  <th className="border border-border p-4 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {ongoingCosts.map((cost, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                    <td className="border border-border p-4 font-medium">{cost.type}</td>
                    <td className="border border-border p-4 text-center">{cost.residential}</td>
                    <td className="border border-border p-4 text-center">{cost.commercial}</td>
                    <td className="border border-border p-4 text-sm text-muted-foreground">{cost.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Real Estate Agent Fees */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Real Estate Agent Fees</h2>
          
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Standard Rates</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                      <span>3-6% of sales price + VAT</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                      <span>Often covered by seller</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                      <span>May pay reduced or no fee</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    Future Homes Advantage
                  </h4>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    We often negotiate reduced or waived commission fees for our clients, 
                    as sellers frequently cover agency costs as part of our comprehensive service.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Legal Services */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Legal Services & Support</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Independent Lawyer Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span>Legal Agreement Review</span>
                    <span className="font-semibold">1% of sales price</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Document Preparation</span>
                    <span className="font-semibold">Included</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Title Deed Assistance</span>
                    <span className="font-semibold">Included</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200">
                  Future Homes Legal Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-blue-700 dark:text-blue-300">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    <span>Free in-house legal team</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    <span>Power of attorney assistance</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    <span>Document translation services</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    <span>Complete process guidance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Cost Calculator Example */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Example Cost Calculation</h2>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Euro className="h-6 w-6 text-primary mr-2" />
                Property Value: $400,000 USD
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Property Purchase Tax (4%)</span>
                  <span className="font-semibold">${totalTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Legal & Administrative Fees</span>
                  <span className="font-semibold">$3,000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Translation & Documentation</span>
                  <span className="font-semibold">$1,500</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Utilities & Setup Costs</span>
                  <span className="font-semibold">$2,000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Miscellaneous Costs</span>
                  <span className="font-semibold">$1,500</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t-2 border-primary text-lg font-bold">
                  <span>Total Additional Costs</span>
                  <span className="text-primary">${totalCosts.toLocaleString()} ({percentageOfValue}%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
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
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Property Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get expert guidance on all aspects of buying property in Turkey, including detailed cost calculations and free legal support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/properties">Browse Properties</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Get Cost Consultation</Link>
            </Button>
          </div>
        </section>
      </main>

      <FAQSchema faqItems={faqItems} />
    </div>
  );
};

export default ExpensesBuyingPropertyTurkey;