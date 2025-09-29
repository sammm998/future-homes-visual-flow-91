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
 
 
  
];

export const getArticleById = (id: number): Article | undefined => {
  return articles.find(article => article.id === id);
};