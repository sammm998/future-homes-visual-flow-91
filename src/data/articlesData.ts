// Shared articles data for Information and Article components
import { FileText, Heart, CreditCard, Scale, Home, Users, DollarSign, Briefcase, Calculator, Building, Activity, Award, MapPin, Globe, Wifi, Camera, ShoppingCart, Utensils, Gamepad2, Palette, Clock, Zap, Trophy, ScrollText } from "lucide-react";

export interface Article {
  id: number;
  title: string;
  description: string;
  icon: any; // Use any for Lucide icon components
  image?: string;
  category: string;
  content: string;
}

export const articles: Article[] = [
  {
    id: 1,
    title: "Turkish Citizenship",
    description: "Complete guide to obtaining Turkish citizenship through property investment",
    icon: FileText,
    category: "legal",
    content: `
      <div class="space-y-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-foreground mb-4">Turkish Citizenship Through Property Investment</h1>
          <p class="text-xl text-muted-foreground">Turkey offers a unique opportunity to obtain citizenship through property investment. This comprehensive guide covers everything you need to know about this pathway to Turkish citizenship.</p>
        </div>

        <div class="bg-primary/5 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-primary mb-4">Investment Requirements</h2>
          <p class="text-lg leading-relaxed">To qualify for Turkish citizenship, you must invest a minimum of $400,000 in Turkish real estate. This investment must be maintained for at least 3 years.</p>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-foreground mb-4">Application Process</h2>
          <p class="text-lg leading-relaxed mb-4">The application process typically takes 3-6 months and involves several steps including property purchase, legal documentation, and government approvals.</p>
          
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-xl font-semibold mb-3">Step-by-Step Process:</h3>
            <ol class="list-decimal list-inside space-y-2">
              <li>Purchase property worth minimum $400,000</li>
              <li>Submit application to property register</li>
              <li>Ministry determines property value</li>
              <li>Property marked as non-sellable for 3 years</li>
              <li>Submit citizenship application</li>
              <li>Receive citizenship decision</li>
              <li>Apply for Turkish passport</li>
            </ol>
          </div>
        </div>

        <div class="bg-green-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-green-800 mb-4">Advantages of Turkish Citizenship</h2>
          <p class="text-lg text-green-700 mb-4">There are great advantages with obtaining a Turkish citizenship. Some of these are:</p>
          
          <ul class="space-y-3">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>You can keep your current nationality and passport</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>The application process only takes 4 months</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>You get visa-free entry to 110+ countries</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Access to free healthcare and education</span>
            </li>
          </ul>
        </div>

        <div class="bg-yellow-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-yellow-800 mb-4">Investment Options</h2>
          <p class="text-lg text-yellow-700 mb-4">What investments are required to meet the conditions for a Turkish citizenship?</p>
          
          <ul class="space-y-3">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>An investment of at least USD 400,000 or its equivalent in foreign currency or Turkish lira</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>A deposit of at least USD 400,000 or the equivalent in foreign currency or Turkish lira to a bank operating in Turkey. This provided that the money is not withdrawn over the next three years</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Purchase of shares, purchase of real estate, investment funds or venture capital investment funds for at least USD 400,000 or the equivalent in foreign currency or Turkish lira. This provided that the holding is not sold for the next three years</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Purchase of government bonds worth at least USD 400,000 or the equivalent in foreign currency or Turkish lira, provided that the holding is not sold for the next three years</span>
            </li>
          </ul>
        </div>
      </div>
    `
  },
  {
    id: 2,
    title: "Property Purchase Process",
    description: "Step-by-step guide to buying property in Turkey",
    icon: Home,
    category: "property",
    content: `
      <div class="space-y-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-foreground mb-4">Complete Guide to Buying Property in Turkey</h1>
          <p class="text-xl text-muted-foreground">Turkey offers excellent opportunities for property investment. This guide walks you through the entire purchase process step by step.</p>
        </div>

        <div class="bg-blue-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-blue-800 mb-4">Why Choose Turkey for Property Investment?</h2>
          <ul class="space-y-3 text-blue-700">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Growing real estate market with strong potential</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Strategic location between Europe and Asia</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Pathway to Turkish citizenship</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-foreground mb-4">Required Documents</h2>
          <ul class="space-y-3">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Valid passport</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Turkish tax number</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Property evaluation report</span>
            </li>
          </ul>
        </div>
      </div>
    `
  },
  {
    id: 3,
    title: "Banking in Turkey",
    description: "Opening bank accounts and financial services for residents",
    icon: CreditCard,
    category: "financial",
    content: `
      <div class="space-y-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-foreground mb-4">Banking Services in Turkey</h1>
          <p class="text-xl text-muted-foreground">Complete guide to opening bank accounts, financial services, and banking procedures in Turkey for residents and citizens.</p>
        </div>

        <div class="bg-blue-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-blue-800 mb-4">Major Turkish Banks</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-bold mb-2 text-blue-700">State Banks:</h3>
              <ul class="space-y-1">
                <li>• Ziraat Bankası</li>
                <li>• Halkbank</li>
                <li>• Vakıfbank</li>
              </ul>
            </div>
            <div>
              <h3 class="font-bold mb-2 text-blue-700">Private Banks:</h3>
              <ul class="space-y-1">
                <li>• İş Bankası</li>
                <li>• Garanti BBVA</li>
                <li>• Akbank</li>
                <li>• Yapı Kredi</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-foreground mb-4">Account Opening Requirements</h2>
          <ul class="space-y-3">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Valid passport with entry stamp</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Turkish tax number (vergi numarası)</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Proof of address in Turkey</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Initial deposit (varies by bank)</span>
            </li>
          </ul>
        </div>

        <div class="bg-yellow-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-yellow-800 mb-4">Banking Services</h2>
          <div class="grid md:grid-cols-3 gap-4">
            <div>
              <h3 class="font-bold mb-2">Digital Banking:</h3>
              <ul class="space-y-1 text-sm">
                <li>• Mobile banking apps</li>
                <li>• Online transfers</li>
                <li>• Bill payments</li>
                <li>• Digital wallet services</li>
              </ul>
            </div>
            <div>
              <h3 class="font-bold mb-2">Card Services:</h3>
              <ul class="space-y-1 text-sm">
                <li>• Debit cards</li>
                <li>• Credit cards</li>
                <li>• Contactless payments</li>
                <li>• ATM network access</li>
              </ul>
            </div>
            <div>
              <h3 class="font-bold mb-2">Investment:</h3>
              <ul class="space-y-1 text-sm">
                <li>• Savings accounts</li>
                <li>• Time deposits</li>
                <li>• Investment funds</li>
                <li>• Foreign exchange</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 4,
    title: "Residence Permits",
    description: "Legal requirements and application process for residence permits",
    icon: Scale,
    category: "legal",
    content: `
      <div class="space-y-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-foreground mb-4">Turkish Residence Permits Guide</h1>
          <p class="text-xl text-muted-foreground">Comprehensive information about obtaining and maintaining residence permits in Turkey for different purposes and durations.</p>
        </div>

        <div class="bg-green-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-green-800 mb-4">Types of Residence Permits</h2>
          <div class="space-y-4">
            <div class="border-l-4 border-green-500 pl-4">
              <h3 class="font-bold text-green-700">Short-term Residence Permit</h3>
              <p class="text-sm text-green-600">Valid for up to 1 year, renewable. For tourism, business, education, or family reunification.</p>
            </div>
            <div class="border-l-4 border-blue-500 pl-4">
              <h3 class="font-bold text-blue-700">Family Residence Permit</h3>
              <p class="text-sm text-blue-600">For family members of Turkish citizens or permit holders. Valid for up to 2 years.</p>
            </div>
            <div class="border-l-4 border-purple-500 pl-4">
              <h3 class="font-bold text-purple-700">Student Residence Permit</h3>
              <p class="text-sm text-purple-600">For enrolled students. Valid for duration of studies plus 6 months.</p>
            </div>
            <div class="border-l-4 border-orange-500 pl-4">
              <h3 class="font-bold text-orange-700">Long-term Residence Permit</h3>
              <p class="text-sm text-orange-600">After 8 years of continuous residence. Valid for indefinite period.</p>
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-foreground mb-4">Application Process</h2>
          <div class="bg-gray-50 p-4 rounded-lg">
            <ol class="list-decimal list-inside space-y-2">
              <li>Gather required documents</li>
              <li>Schedule appointment online at e-ikamet.gov.tr</li>
              <li>Submit application at Provincial Directorate of Migration Management</li>
              <li>Pay application fee</li>
              <li>Provide biometric data</li>
              <li>Wait for decision (30-60 days)</li>
              <li>Collect residence permit card</li>
            </ol>
          </div>
        </div>

        <div class="bg-red-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-red-800 mb-4">Important Requirements</h2>
          <ul class="space-y-3">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Valid passport with at least 60 days validity beyond permit period</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Health insurance covering entire permit period</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Proof of sufficient financial means</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Accommodation proof</span>
            </li>
          </ul>
        </div>
      </div>
    `
  },
  {
    id: 5,
    title: "Education System",
    description: "Schools, universities and educational opportunities in Turkey",
    icon: Users,
    category: "living",
    content: `
      <div class="space-y-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-foreground mb-4">Education System in Turkey</h1>
          <p class="text-xl text-muted-foreground">Complete guide to educational opportunities, schools, and universities in Turkey for residents and international students.</p>
        </div>

        <div class="bg-blue-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-blue-800 mb-4">Education Structure</h2>
          <div class="grid md:grid-cols-3 gap-4">
            <div class="text-center">
              <h3 class="font-bold text-blue-700 mb-2">Primary Education</h3>
              <p class="text-sm">Ages 6-14 (8 years)</p>
              <p class="text-xs text-blue-600">Compulsory and free</p>
            </div>
            <div class="text-center">
              <h3 class="font-bold text-blue-700 mb-2">Secondary Education</h3>
              <p class="text-sm">Ages 14-18 (4 years)</p>
              <p class="text-xs text-blue-600">Various track options</p>
            </div>
            <div class="text-center">
              <h3 class="font-bold text-blue-700 mb-2">Higher Education</h3>
              <p class="text-sm">Universities & colleges</p>
              <p class="text-xs text-blue-600">Public and private options</p>
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-foreground mb-4">International Schools</h2>
          <div class="space-y-4">
            <div class="border-l-4 border-green-500 pl-4">
              <h3 class="font-bold">American Schools</h3>
              <p class="text-sm text-gray-600">US curriculum, English instruction, AP courses</p>
            </div>
            <div class="border-l-4 border-red-500 pl-4">
              <h3 class="font-bold">British Schools</h3>
              <p class="text-sm text-gray-600">UK curriculum, IGCSE and A-levels</p>
            </div>
            <div class="border-l-4 border-blue-500 pl-4">
              <h3 class="font-bold">International Baccalaureate</h3>
              <p class="text-sm text-gray-600">IB program schools with global recognition</p>
            </div>
          </div>
        </div>

        <div class="bg-green-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-green-800 mb-4">Top Universities</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-bold mb-2 text-green-700">Public Universities:</h3>
              <ul class="space-y-1">
                <li>• Middle East Technical University (METU)</li>
                <li>• Boğaziçi University</li>
                <li>• Istanbul Technical University</li>
                <li>• Ankara University</li>
              </ul>
            </div>
            <div>
              <h3 class="font-bold mb-2 text-green-700">Private Universities:</h3>
              <ul class="space-y-1">
                <li>• Koç University</li>
                <li>• Sabancı University</li>
                <li>• Bilkent University</li>
                <li>• Istanbul Bilgi University</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 6,
    title: "Healthcare System",
    description: "Understanding healthcare services and insurance in Turkey",
    icon: Heart,
    category: "living",
    content: `
      <div class="space-y-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-foreground mb-4">Healthcare System in Turkey</h1>
          <p class="text-xl text-muted-foreground">Comprehensive guide to healthcare services, insurance options, and medical facilities in Turkey for residents and citizens.</p>
        </div>

        <div class="bg-green-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-green-800 mb-4">Universal Healthcare Coverage</h2>
          <p class="text-lg text-green-700 mb-4">Turkey operates a universal healthcare system called Social Security Institution (SGK) that provides comprehensive medical coverage to all citizens and legal residents.</p>
          
          <ul class="space-y-3">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Free or low-cost medical treatment at public hospitals</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Prescription medication subsidies</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Emergency services available 24/7</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Specialist care and diagnostic services</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-foreground mb-4">Healthcare Options</h2>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-blue-50 p-6 rounded-lg">
              <h3 class="text-xl font-bold text-blue-800 mb-3">Public Healthcare</h3>
              <ul class="space-y-2 text-blue-700">
                <li>• State hospitals and clinics</li>
                <li>• SGK insurance coverage</li>
                <li>• Low-cost treatments</li>
                <li>• Longer waiting times</li>
              </ul>
            </div>
            
            <div class="bg-purple-50 p-6 rounded-lg">
              <h3 class="text-xl font-bold text-purple-800 mb-3">Private Healthcare</h3>
              <ul class="space-y-2 text-purple-700">
                <li>• Modern private hospitals</li>
                <li>• Shorter waiting times</li>
                <li>• English-speaking staff</li>
                <li>• Higher costs without insurance</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-yellow-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-yellow-800 mb-4">Insurance Requirements</h2>
          <p class="text-lg text-yellow-700 mb-4">All residents must have health insurance in Turkey:</p>
          
          <ul class="space-y-3">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span><strong>Citizens:</strong> Automatic SGK coverage through employment or voluntary enrollment</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span><strong>Residents:</strong> Must register for SGK within 60 days of arrival</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span><strong>Tourists:</strong> Travel insurance recommended for emergency coverage</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span><strong>Private Insurance:</strong> Additional coverage for private healthcare facilities</span>
            </li>
          </ul>
        </div>

        <div class="bg-red-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-red-800 mb-4">Emergency Services</h2>
          <p class="text-lg text-red-700 mb-4">Important emergency numbers and information:</p>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-bold mb-2">Emergency Numbers:</h3>
              <ul class="space-y-1">
                <li>• <strong>112:</strong> General Emergency</li>
                <li>• <strong>110:</strong> Fire Department</li>
                <li>• <strong>155:</strong> Police</li>
                <li>• <strong>110:</strong> Ambulance</li>
              </ul>
            </div>
            <div>
              <h3 class="font-bold mb-2">Emergency Coverage:</h3>
              <ul class="space-y-1">
                <li>• Free emergency treatment</li>
                <li>• 24/7 ambulance service</li>
                <li>• Emergency rooms in all hospitals</li>
                <li>• No advance payment required</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 7,
    title: "Dubai Business Setup Guide",
    description: "Complete guide to starting a business in Dubai",
    icon: Briefcase,
    category: "business",
    content: `
      <div class="space-y-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-foreground mb-4">Dubai Business Setup Guide</h1>
          <p class="text-xl text-muted-foreground">Comprehensive guide to establishing your business in Dubai, UAE with step-by-step procedures and requirements.</p>
        </div>

        <div class="bg-blue-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-blue-800 mb-4">Why Choose Dubai for Business?</h2>
          <ul class="space-y-3 text-blue-700">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>0% personal and corporate income tax</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>100% foreign ownership allowed</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Strategic location between East and West</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>World-class infrastructure and business facilities</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-foreground mb-4">Business Structure Options</h2>
          
          <div class="grid md:grid-cols-3 gap-6">
            <div class="bg-green-50 p-6 rounded-lg">
              <h3 class="text-xl font-bold text-green-800 mb-3">Free Zone Company</h3>
              <ul class="space-y-2 text-green-700 text-sm">
                <li>• 100% foreign ownership</li>
                <li>• No corporate tax</li>
                <li>• Easy setup process</li>
                <li>• Limited mainland trading</li>
              </ul>
            </div>
            
            <div class="bg-purple-50 p-6 rounded-lg">
              <h3 class="text-xl font-bold text-purple-800 mb-3">Mainland Company</h3>
              <ul class="space-y-2 text-purple-700 text-sm">
                <li>• Trade anywhere in UAE</li>
                <li>• Government contracts eligible</li>
                <li>• UAE national partner required</li>
                <li>• More complex setup</li>
              </ul>
            </div>

            <div class="bg-orange-50 p-6 rounded-lg">
              <h3 class="text-xl font-bold text-orange-800 mb-3">Offshore Company</h3>
              <ul class="space-y-2 text-orange-700 text-sm">
                <li>• International business focus</li>
                <li>• Asset protection benefits</li>
                <li>• Cannot trade in UAE</li>
                <li>• Banking requirements</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-yellow-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-yellow-800 mb-4">Setup Process</h2>
          <div class="space-y-4">
            <div class="border-l-4 border-yellow-500 pl-4">
              <h3 class="font-bold text-yellow-700">1. Choose Business Activity & Name</h3>
              <p class="text-sm text-yellow-600">Select from approved business activities and reserve unique company name</p>
            </div>
            <div class="border-l-4 border-yellow-500 pl-4">
              <h3 class="font-bold text-yellow-700">2. Choose Jurisdiction</h3>
              <p class="text-sm text-yellow-600">Select free zone, mainland, or offshore based on business needs</p>
            </div>
            <div class="border-l-4 border-yellow-500 pl-4">
              <h3 class="font-bold text-yellow-700">3. Prepare Documentation</h3>
              <p class="text-sm text-yellow-600">Gather required documents including passport copies and NOCs</p>
            </div>
            <div class="border-l-4 border-yellow-500 pl-4">
              <h3 class="font-bold text-yellow-700">4. Submit Application</h3>
              <p class="text-sm text-yellow-600">File application with relevant authority and pay fees</p>
            </div>
            <div class="border-l-4 border-yellow-500 pl-4">
              <h3 class="font-bold text-yellow-700">5. Obtain Licenses</h3>
              <p class="text-sm text-yellow-600">Receive trade license and additional permits if required</p>
            </div>
          </div>
        </div>

        <div class="bg-red-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-red-800 mb-4">Required Documents</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-bold mb-2 text-red-700">Personal Documents:</h3>
              <ul class="space-y-1 text-sm">
                <li>• Passport copy (attested)</li>
                <li>• Educational certificates</li>
                <li>• Experience certificates</li>
                <li>• No Objection Certificate (NOC)</li>
              </ul>
            </div>
            <div>
              <h3 class="font-bold mb-2 text-red-700">Business Documents:</h3>
              <ul class="space-y-1 text-sm">
                <li>• Business plan</li>
                <li>• Financial projections</li>
                <li>• Office lease agreement</li>
                <li>• Bank reference letter</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-foreground mb-4">Popular Free Zones</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <ul class="space-y-2">
              <li class="flex items-start">
                <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>DIFC:</strong> Financial services hub</span>
              </li>
              <li class="flex items-start">
                <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>DMCC:</strong> Commodities and trading</span>
              </li>
              <li class="flex items-start">
                <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>DAFZA:</strong> Aviation and logistics</span>
              </li>
            </ul>
            <ul class="space-y-2">
              <li class="flex items-start">
                <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>DWTC:</strong> Trade and exhibitions</span>
              </li>
              <li class="flex items-start">
                <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>TECOM:</strong> Technology and media</span>
              </li>
              <li class="flex items-start">
                <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>RAKEZ:</strong> Manufacturing focus</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 8,
    title: "The Bali Lifestyle Appeal",
    description: "Discover the unique lifestyle and investment opportunities in Bali",
    icon: MapPin,
    category: "living",
    content: `
      <div class="space-y-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-foreground mb-4">The Bali Lifestyle Appeal</h1>
          <p class="text-xl text-muted-foreground">Bali has captured the hearts of international property buyers not just for its investment potential, but for the extraordinary lifestyle it offers. The Island of Gods provides a unique blend of tropical paradise, rich cultural heritage, and modern amenities.</p>
        </div>

        <div>
          <h2 class="text-3xl font-bold text-foreground mb-6">Natural Beauty and Climate</h2>
          <p class="text-lg leading-relaxed mb-6">The island's year-round tropical climate, stunning beaches, and lush landscapes provide an idyllic backdrop for daily life. From sunrise yoga sessions overlooking rice terraces to sunset cocktails on pristine beaches, Bali offers a natural setting that enhances quality of life in ways that few destinations can match.</p>
          
          <p class="text-lg leading-relaxed mb-6">The diverse geography means you can choose from beachfront villas in Seminyak, jungle retreats in Ubud, or cliff-top properties in Uluwatu, each offering its own unique lifestyle experience.</p>
        </div>

        <div class="bg-primary/5 p-6 rounded-lg">
          <h3 class="text-2xl font-bold text-primary mb-4">Rich Cultural Heritage</h3>
          <p class="text-lg leading-relaxed mb-4">Living in Bali means immersing yourself in a culture that values spirituality, community, and artistic expression. The Balinese Hindu traditions create a peaceful, harmonious atmosphere that many international residents find deeply enriching.</p>
          
          <p class="text-lg leading-relaxed">Daily temple ceremonies, traditional art forms, and the warm hospitality of the Balinese people contribute to a sense of belonging that goes beyond mere property ownership.</p>
        </div>

        <div class="bg-green-50 p-6 rounded-lg">
          <h3 class="text-2xl font-bold text-green-800 mb-4">Modern Amenities and Infrastructure</h3>
          <p class="text-lg text-green-700 mb-4">Despite its traditional charm, Bali offers excellent modern infrastructure. High-speed internet makes it ideal for digital nomads and remote workers, while international schools cater to expat families. World-class restaurants, spas, and healthcare facilities ensure comfort and convenience.</p>
        </div>

        <div class="bg-blue-50 p-6 rounded-lg">
          <h3 class="text-2xl font-bold text-blue-800 mb-4">Community and Networking</h3>
          <p class="text-lg text-blue-700 mb-4">The international community in Bali is vibrant and welcoming. Networking events, co-working spaces, and social clubs make it easy to connect with like-minded individuals from around the world, creating both personal and professional opportunities.</p>
        </div>

        <div class="bg-yellow-50 p-6 rounded-lg">
          <h3 class="text-2xl font-bold text-yellow-800 mb-4">Cost of Living Advantages</h3>
          <p class="text-lg text-yellow-700 mb-4">Compared to major Western cities, Bali offers exceptional value for money. Your property investment can provide not just potential returns, but also access to a high-quality lifestyle at a fraction of the cost you might expect elsewhere.</p>
        </div>

        <div>
          <h2 class="text-3xl font-bold text-foreground mb-6">Investment Opportunities</h2>
          <p class="text-lg leading-relaxed mb-6">Bali's property market offers diverse investment opportunities, from luxury villas that can generate strong rental income to commercial properties in growing tourist areas. The combination of lifestyle benefits and investment potential makes Bali an attractive proposition for discerning international buyers.</p>

          <blockquote class="border-l-4 border-primary pl-6 py-4 my-6 bg-muted/50 rounded-r-lg">
            <p class="text-foreground font-medium italic">"Bali isn't just a place to invest; it's a place to live a richer, more fulfilling life while your investment grows."</p>
          </blockquote>
        </div>
      </div>
    `
  },
  {
    id: 9,
    title: "Cost of Living in Turkey",
    description: "Complete guide to living expenses and costs in Turkey",
    icon: Calculator,
    category: "financial",
    content: `
      <div class="space-y-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-foreground mb-4">Cost of Living in Turkey</h1>
          <p class="text-xl text-muted-foreground">Comprehensive breakdown of living expenses, housing costs, and daily expenses for residents and expats in Turkey.</p>
        </div>

        <div class="bg-green-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-green-800 mb-4">Housing Costs</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-bold mb-3 text-green-700">Istanbul (Average Monthly Rent)</h3>
              <ul class="space-y-2">
                <li>• 1 bedroom apartment: $400-800</li>
                <li>• 2 bedroom apartment: $600-1,200</li>
                <li>• 3 bedroom apartment: $800-1,800</li>
                <li>• Luxury properties: $1,500-3,000+</li>
              </ul>
            </div>
            <div>
              <h3 class="font-bold mb-3 text-green-700">Other Major Cities</h3>
              <ul class="space-y-2">
                <li>• Ankara: 20-30% less than Istanbul</li>
                <li>• Izmir: 15-25% less than Istanbul</li>
                <li>• Antalya: 10-20% less than Istanbul</li>
                <li>• Coastal areas: Variable by season</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-blue-800 mb-4">Daily Expenses</h2>
          <div class="grid md:grid-cols-3 gap-4">
            <div>
              <h3 class="font-bold mb-2 text-blue-700">Food & Dining:</h3>
              <ul class="space-y-1 text-sm">
                <li>• Restaurant meal: $3-15</li>
                <li>• Fast food: $2-5</li>
                <li>• Groceries (monthly): $150-300</li>
                <li>• Coffee: $1-3</li>
              </ul>
            </div>
            <div>
              <h3 class="font-bold mb-2 text-blue-700">Transportation:</h3>
              <ul class="space-y-1 text-sm">
                <li>• Public transport: $0.30 per ride</li>
                <li>• Monthly pass: $15-25</li>
                <li>• Taxi (per km): $0.40-0.60</li>
                <li>• Fuel (per liter): $0.80-1.00</li>
              </ul>
            </div>
            <div>
              <h3 class="font-bold mb-2 text-blue-700">Utilities:</h3>
              <ul class="space-y-1 text-sm">
                <li>• Electricity: $30-80/month</li>
                <li>• Internet: $10-20/month</li>
                <li>• Mobile phone: $5-15/month</li>
                <li>• Water: $10-20/month</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-yellow-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-yellow-800 mb-4">Monthly Budget Estimates</h2>
          <div class="grid md:grid-cols-3 gap-4">
            <div class="border-l-4 border-yellow-500 pl-4">
              <h3 class="font-bold text-yellow-700">Budget Living</h3>
              <p class="text-2xl font-bold text-yellow-600">$500-800/month</p>
              <p class="text-sm">Basic apartment, local food, public transport</p>
            </div>
            <div class="border-l-4 border-orange-500 pl-4">
              <h3 class="font-bold text-orange-700">Comfortable Living</h3>
              <p class="text-2xl font-bold text-orange-600">$1,000-1,800/month</p>
              <p class="text-sm">Nice apartment, mixed dining, occasional taxi</p>
            </div>
            <div class="border-l-4 border-red-500 pl-4">
              <h3 class="font-bold text-red-700">Luxury Living</h3>
              <p class="text-2xl font-bold text-red-600">$2,500+/month</p>
              <p class="text-sm">Premium location, fine dining, private transport</p>
            </div>
          </div>
        </div>
      </div>
    `
  },
  
  {
    id: 11,
    title: "Turkish Work Permits",
    description: "Complete guide to obtaining work permits in Turkey",
    icon: ScrollText,
    category: "legal",
    content: `
      <div class="space-y-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-foreground mb-4">Turkish Work Permits Guide</h1>
          <p class="text-xl text-muted-foreground">Comprehensive information about obtaining work permits, employment procedures, and legal requirements for working in Turkey.</p>
        </div>

        <div class="bg-blue-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-blue-800 mb-4">Types of Work Permits</h2>
          <div class="space-y-4">
            <div class="border-l-4 border-blue-500 pl-4">
              <h3 class="font-bold text-blue-700">Definite-Term Work Permit</h3>
              <p class="text-sm text-blue-600">For specific employers, maximum 1 year initially, renewable up to 3 years</p>
            </div>
            <div class="border-l-4 border-green-500 pl-4">
              <h3 class="font-bold text-green-700">Indefinite-Term Work Permit</h3>
              <p class="text-sm text-green-600">After 6 years of legal work, allows changing employers freely</p>
            </div>
            <div class="border-l-4 border-purple-500 pl-4">
              <h3 class="font-bold text-purple-700">Independent Work Permit</h3>
              <p class="text-sm text-purple-600">For self-employment and business ownership</p>
            </div>
          </div>
        </div>

        <div class="bg-green-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-green-800 mb-4">Application Process</h2>
          <ol class="list-decimal list-inside space-y-3">
            <li>Job offer from Turkish employer</li>
            <li>Employer applies to Ministry of Labor</li>
            <li>Submit required documents</li>
            <li>Pay application fees</li>
            <li>Wait for approval (30-60 days)</li>
            <li>Apply for residence permit</li>
            <li>Register with Social Security Institution</li>
          </ol>
        </div>

        <div class="bg-yellow-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-yellow-800 mb-4">Required Documents</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-bold mb-2 text-yellow-700">Personal Documents:</h3>
              <ul class="space-y-1 text-sm">
                <li>• Valid passport</li>
                <li>• Birth certificate</li>
                <li>• Criminal background check</li>
                <li>• Health report</li>
                <li>• Educational certificates</li>
              </ul>
            </div>
            <div>
              <h3 class="font-bold mb-2 text-yellow-700">Employment Documents:</h3>
              <ul class="space-y-1 text-sm">
                <li>• Employment contract</li>
                <li>• Company registration documents</li>
                <li>• Job description</li>
                <li>• Salary details</li>
                <li>• Work experience certificates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 12,
    title: "International Tax Planning",
    description: "Tax optimization strategies for international investors",
    icon: Building,
    category: "financial",
    content: `
      <div class="space-y-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-foreground mb-4">International Tax Planning Guide</h1>
          <p class="text-xl text-muted-foreground">Strategic tax planning for international property investors and expatriates across multiple jurisdictions.</p>
        </div>

        <div class="bg-blue-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-blue-800 mb-4">Tax Residency Planning</h2>
          <p class="text-lg text-blue-700 mb-4">Understanding tax residency rules is crucial for optimizing your global tax position:</p>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-bold mb-2 text-blue-700">Key Factors:</h3>
              <ul class="space-y-1">
                <li>• Days spent in each country</li>
                <li>• Economic ties and connections</li>
                <li>• Property ownership locations</li>
                <li>• Business activities</li>
              </ul>
            </div>
            <div>
              <h3 class="font-bold mb-2 text-blue-700">Common Structures:</h3>
              <ul class="space-y-1">
                <li>• Non-resident tax status</li>
                <li>• Treaty benefits utilization</li>
                <li>• Offshore company structures</li>
                <li>• Trust arrangements</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-green-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-green-800 mb-4">Property Investment Tax Strategies</h2>
          <div class="space-y-4">
            <div class="border-l-4 border-green-500 pl-4">
              <h3 class="font-bold text-green-700">Holding Structure Optimization</h3>
              <p class="text-sm text-green-600">Corporate vs. personal ownership for tax efficiency</p>
            </div>
            <div class="border-l-4 border-blue-500 pl-4">
              <h3 class="font-bold text-blue-700">Capital Gains Planning</h3>
              <p class="text-sm text-blue-600">Timing of sales and exemption utilization</p>
            </div>
            <div class="border-l-4 border-purple-500 pl-4">
              <h3 class="font-bold text-purple-700">Rental Income Optimization</h3>
              <p class="text-sm text-purple-600">Deduction maximization and income smoothing</p>
            </div>
          </div>
        </div>

        <div class="bg-yellow-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-yellow-800 mb-4">Double Taxation Treaties</h2>
          <p class="text-lg text-yellow-700 mb-4">Leveraging international tax treaties to avoid double taxation:</p>
          
          <ul class="space-y-3">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Reduced withholding tax rates on dividends, interest, and royalties</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Capital gains exemptions for certain property types</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Mutual agreement procedures for dispute resolution</span>
            </li>
          </ul>
        </div>

        <div class="bg-red-50 p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-red-800 mb-4">Compliance Requirements</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-bold mb-2 text-red-700">Reporting Obligations:</h3>
              <ul class="space-y-1 text-sm">
                <li>• Foreign asset reporting</li>
                <li>• Transfer pricing documentation</li>
                <li>• Controlled foreign company rules</li>
                <li>• Automatic exchange of information</li>
              </ul>
            </div>
            <div>
              <h3 class="font-bold mb-2 text-red-700">Best Practices:</h3>
              <ul class="space-y-1 text-sm">
                <li>• Regular compliance reviews</li>
                <li>• Professional tax advice</li>
                <li>• Documentation maintenance</li>
                <li>• Proactive planning updates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `
  }
];

export const getArticleById = (id: number): Article | undefined => {
  return articles.find(article => article.id === id);
};