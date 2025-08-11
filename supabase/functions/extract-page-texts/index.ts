import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { filePath, component } = await req.json();

    if (!filePath || !component) {
      return new Response(
        JSON.stringify({ error: 'Missing filePath or component parameter' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Simulate reading the file content - in production this would read actual files
    const extractedTexts = await extractAllTextsFromComponent(component);

    return new Response(
      JSON.stringify({ texts: extractedTexts }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in extract-page-texts function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Comprehensive text extraction for each component
async function extractAllTextsFromComponent(component: string): Promise<string[]> {
  const allTexts: { [key: string]: string[] } = {
    'Index': [
      // Hero Section
      "Future Homes",
      "Your Future in Real Estate",
      "Expert guidance for property investment in Turkey and beyond",
      "Find Your Dream Property",
      "View Properties",
      
      // Before & After section
      "Property",
      "Before & After", 
      "See the transformation of our premium properties",
      
      // Interactive Selector
      "DUBAI",
      "CYPRUS", 
      "STRASBOURG",
      "MERSIN",
      "TALK TO AI",
      "SEE ALL",
      "Discover properties in our most sought-after destinations",
      "Antalya",
      "Turkish Riviera Paradise",
      "Visa egenskaper",
      "Discover premium properties in the world's most desirable locations",
      
      // Premium Properties Section  
      "Premiumfastigheter",
      "Premium Properties",
      "Premium Properties Worldwide",
      "Discover your dream home from our exclusive collection",
      "Explore our handpicked selection of luxury properties across Turkey, Dubai, Cyprus, and France. Each property offers unique features and exceptional value for your investment.",
      "Explore our carefully curated selection of premium properties",
      "View All Properties",
      
      // Property Cards
      "Twin villas with launch price in new project",
      "Luxury apartments with walking distance to the beach", 
      "Spacious apartments suitable for investment",
      "Stylish apartments with modern design",
      "Luxury apartments in magnificent complex",
      "Ready to move-in luxury apartment close to daily amenities",
      
      // Locations
      "Antalya, Kemer",
      "Dubai, Marina", 
      "Antalya, Aksu",
      "Antalya, Altintas",
      "Dubai, Jumeirah Village Circle",
      
      // Property Details
      "115 m²",
      "3 bed • 2 bath",
      "78-1,505 m²", 
      "1-6 bed • 2-7 bath",
      "75-104 m²",
      "1-2 bed • 1-2 bath",
      "60-100 m²",
      "70-112 m²",
      "72 m²",
      "1 bed • 1 bath",
      
      // Prices
      "€350,000",
      "€1,110,000", 
      "€135,000",
      "€147,000",
      "€313,000",
      "€110,000",
      
      // Testimonials sections
      "Testimonials",
      "What Our Clients Say",
      "Hear from satisfied property owners worldwide",
      "Real Client Experiences", 
      "Verkliga kundupplevelser",
      "Discover how we've helped clients achieve their property investment goals",
      "Upptäck hur vi har hjälpt kunder att uppnå sina fastighetsinvesteringsmål",
      
      // All testimonial texts
      "Thank you for great cooperation. It has been a pleasure getting to know you at Future Homes. Tolga and Ali have been very service-oriented with good communication. Highly recommend!",
      "I bought an apartment through Future Homes with the help of the best Ali. I received wonderful service. Thank you Ali for excellent service and patience.",
      "I wanted to buy a property in Konyaalti when I accidentally came to Future homes and was delighted with their professionalism.",
      "Bought our first apartment in Turkey with Future Homes. Very quick responses to any type of question that we had, everything is explained clearly and thoroughly.",
      "I am very happy with Ali Karan and Future Homes of the sales I did in Antalya. Definitely recommend this company.",
      "Very professional approach. A young company with great ambitions that works hard to ensure the customer goes through a safe real estate transaction.",
      "My husband and I have bought 3 apartments from Ali Karan and Future Homes. I am very satisfied with their professional service and the help I got even after the sale was done.",
      "The best Ali also helped after I bought an apartment from Future homes. I got help with contact with sellers of appliances, furniture, etc.",
      "Ali Karan is a man of his words! The energy he has for work and the dedication he gives to his clients is amazing.",
      "My brother had purchased a property with this company, and due to his experience and service that he had received, he recommended that I should also purchase.",
      "We bought an apartment through Future Homes. Wonderful service. Big thanks to everyone in the team, very satisfied! Warmly recommend.",
      "I bought an apartment in Avsallar through Ali. A really nice and helpful guy who obviously can fix everything! Highly recommended.",
      "Tolga was a very professional person who took good care of every single thing to do for this matter and myself. I recommend them strongly.",
      "Very skilled and kind real estate agent, bought apartment through them. If you want to buy an apartment, contact Ali Karan at Future Homes.",
      "I want to thank Future Homes for their incredible help. I would also like to thank the owner (Ali Bey) and his team, Tolga and Bariş, for always being there for me.",
      "I definitely recommend it. I consider myself very lucky that I found this company. I was looking for an apartment in Antalya near the airport.",
      "I felt really good, professional from the beginning and the process was perfect. Buying real estate is a matter of trust, and I found that trust here.",
      "Future Homes is an agency that I highly recommend! The advisors are very competent! I particularly want to thank Selen who accompanied us throughout our project.",
      
      // Customer names and roles
      "Cahide Celepli",
      "Customer - Sweden",
      "Hanan Aldalawi", 
      "Customer - Dubai",
      "Milan Mitic",
      "Local Guide - Serbia",
      "Olga",
      "Local Guide - Sweden",
      "Maher Mare",
      "Customer - International",
      "Amro",
      "Pro Fast",
      "Elham Ahmadi Farsangi",
      "Ib Awn",
      "Muhammad Umar",
      "Sushil Ran",
      "Olga Aldabbagh",
      "Zaid Mohanad",
      "Dollyz Martinez",
      "Amir Salman",
      "Cuneyt",
      "Customer - London",
      "Lena",
      "Local Guide - Russia",
      "Jens Zierke",
      "Customer - Germany",
      "Florence Manga",
      "Customer - France",
      
      // News & Information section
      "Stay Informed",
      "Nyheter och insikter",
      "Stay updated with the latest real estate trends and market insights",
      "Property Guide",
      "Investment",
      "Bitcoin Property",
      "Dubai Investment", 
      "Dubai Business Guide",
      "Cryptocurrency and property investments",
      "Property investment opportunities in Dubai",
      "Dubai Business Guide: Investment, Real Estate, and Living Abroad Dubai stands as a dynamic global hub, offering immense opportunities for investors, entrepreneurs, and expatriates. This co...",
      "Read More",
      
      // Newsletter
      "Newsletter",
      "Subscribe to our newsletter",
      "Stay updated",
      "Get latest updates",
      
      // Common actions
      "Get Started",
      "Learn More",
      "Contact Us",
      "Search Properties",
      "View All Properties",
      "Find Properties"
    ],
    
    'AboutUs': [
      "About Future Homes",
      "Your Future Real Estate Partner",
      "About Us",
      "Our Story",
      "Our Mission",
      "Our Vision",
      "Our Values",
      
      // Team section
      "Meet Our Team",
      "Our experienced professionals are here to guide you through your property journey",
      "Our Team",
      "Founder",
      "Business Developer", 
      "General Manager",
      "Portfolio Manager",
      "Sales Office Supervisor",
      "Portfolio Supervisor",
      "Dubai Office Manager",
      "Real Estate Consultant",
      
      // Team member names
      "Ali Karan",
      "Cem Çakıroğlu",
      "Tolga Çakıroğlu", 
      "Özgün Baykal",
      "Ervina Köksel",
      "Fırat Ine",
      "Umar",
      "Kim Larsson",
      "Batuhan Kunt",
      
      // Services
      "WE ARE WITH YOU BEFORE AND AFTER SALES",
      "Comprehensive services throughout your property journey",
      "FREE PROPERTY VISITS",
      "We organize free property visits for our clients",
      "SALES CONTRACT",
      "Professional sales contract preparation",
      "GET YOUR TAX NUMBER",
      "Assistance with tax number application",
      "OPEN A BANK ACCOUNT",
      "Help with bank account opening",
      "TRANSLATIONS OF DOCUMENTS",
      "Professional document translation services",
      "RECEIVE YOUR TITLE DEED",
      "Complete title deed transfer process",
      "SERVICES SUBSCRIPTIONS",
      "Utility and service connections",
      "FURNITURE TOUR",
      "Professional furniture selection tours",
      "SELL YOUR PROPERTY",
      "Property resale assistance",
      
      // Languages
      "OUR TEAM SPEAKS 9 DIFFERENT LANGUAGES",
      "To achieve this, we have a strong team behind us who speak multiple languages fluently.",
      "Norwegian",
      "Swedish", 
      "English",
      "Russian",
      "French",
      "Arabic",
      "Farsi",
      "German",
      "Urdu",
      
      // Values
      "Ethics",
      "We conduct business with the highest ethical standards",
      "Professionalism", 
      "Professional service in every aspect of our work",
      "Transparency",
      "Complete transparency in all our dealings",
      "Our values are strongly rooted in good ethics, professionalism and transparency.",
      
      // Locations
      "Future Homes Locations",
      "Where can you find real estate with Future Homes?",
      "Turkey",
      "Antalya, Mersin",
      "France",
      "Strasbourg Office",
      "Dubai",
      "Main Office",
      "Antalya Office",
      "Mersin Office",
      "Dubai Office",
      "France Office"
    ],
    
    'ContactUs': [
      "Contact Us",
      "Get in touch with our property experts",
      "Get in Touch",
      "We're here to help you find your dream property",
      "Contact Information",
      "Phone",
      "Email", 
      "Address",
      "Working Hours",
      "Monday - Friday: 9:00 AM - 6:00 PM",
      "Our Locations",
      "Send Message",
      "Fill out the form below and we'll get back to you shortly",
      
      // Form fields
      "First Name",
      "Last Name",
      "Email Address",
      "your.email@example.com",
      "Phone Number",
      "+90 XXX XXX XX XX",
      "Property Interest",
      "What type of property are you looking for?",
      "Message",
      "Tell us about your requirements...",
      "Sending...",
      "Send Message",
      
      // Contact details
      "info@futurehomesturkey.com",
      "+90 552 303 27 50",
      "Main Office",
      "Antalya Office",
      "Mersin Office", 
      "Dubai Office",
      "France Office"
    ]
  };

  // Add comprehensive property search pages
  const propertySearchTexts = [
    "Properties",
    "Search Properties",
    "Filter Properties",
    "Property Type",
    "Price Range", 
    "Bedrooms",
    "Bathrooms",
    "Location",
    "Features",
    "View Details",
    "Contact Agent",
    "Save Property",
    "Share Property",
    "Investment Properties",
    "New Developments",
    "Luxury Properties",
    "Beachfront Properties",
    "Modern Apartments",
    "Investment Opportunities",
    "Premium Locations",
    "High-end Properties",
    "Property Features",
    "Investment Returns",
    "Rental Yield",
    "Search Results",
    "Sort By",
    "Filter By",
    "Property Listings"
  ];

  // Location-specific content
  const locationTexts: { [key: string]: string[] } = {
    'AntalyaPropertySearch': [
      "Antalya Properties",
      "Turkish Riviera",
      "Antalya Real Estate",
      "Mediterranean Properties",
      ...propertySearchTexts
    ],
    'DubaiPropertySearch': [
      "Dubai Properties", 
      "Dubai Real Estate",
      "Dubai Marina",
      "Downtown Dubai",
      "Business Bay",
      "JBR",
      "Palm Jumeirah",
      "Luxury Real Estate",
      ...propertySearchTexts
    ],
    'CyprusPropertySearch': [
      "Cyprus Properties",
      "Cyprus Real Estate", 
      "Mediterranean Properties",
      "Island Properties",
      "Northern Cyprus",
      "Kyrenia Properties",
      "Famagusta Properties",
      "Beachfront Villas",
      "Cyprus Investment",
      "EU Citizenship",
      ...propertySearchTexts
    ],
    'MersinPropertySearch': [
      "Mersin Properties",
      "Mersin Real Estate",
      "Mediterranean Coast",
      "Coastal Properties",
      "Modern Developments",
      ...propertySearchTexts
    ],
    'FrancePropertySearch': [
      "France Properties",
      "French Properties",
      "European Real Estate",
      "Luxury France",
      "Investment France",
      "French Riviera",
      "Paris Properties",
      "Lyon Properties",
      "European Investment",
      ...propertySearchTexts
    ]
  };

  // Add location-specific texts to main object
  Object.assign(allTexts, locationTexts);

  // Add other pages
  allTexts['PropertyWizard'] = [
    "Property Wizard",
    "Find Your Perfect Property",
    "Step by Step Guide",
    "Investment Calculator",
    "Property Search",
    "Guided Tour",
    "Property Finder",
    "Investment Guide",
    "Property Selection",
    "Investment Analysis",
    "Where would you like to invest?",
    "Choose your preferred location",
    "What type of property interests you?",
    "Select your ideal property type",
    "What's your investment budget?",
    "Choose your price range",
    "What features are important to you?",
    "Select all that apply",
    "Almost there! Let's get in touch",
    "Please provide your contact information so we can assist you better"
  ];

  allTexts['Information'] = [
    "Information",
    "Property Investment Guide",
    "Real Estate News",
    "Market Insights",
    "Investment Tips",
    "Property Guides",
    "Market Analysis",
    "Property Blog",
    "Latest News",
    "Expert Articles",
    "All",
    "Property",
    "Legal",
    "Finance", 
    "Living",
    "Investment"
  ];

  allTexts['AIPropertySearch'] = [
    "AI Property Search",
    "Smart Property Finder",
    "AI-Powered Search",
    "Intelligent Property Search",
    "Advanced Search",
    "Property AI",
    "Smart Recommendations",
    "AI Property Assistant",
    "Automated Search",
    "Property Intelligence",
    "AI Assistant",
    "Hello! I'm your Future AI assistant. How can I help you find the perfect property today?",
    "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
    "Type your message here...",
    "We'd like to help you better! Please share your contact information:"
  ];

  return allTexts[component] || [];
}