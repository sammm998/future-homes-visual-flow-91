import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pageComponent } = await req.json();

    // Simulate reading all component files and extracting ALL text content
    // In production, this would scan actual React files
    const extractedTexts = await extractAllPageContent(pageComponent);

    return new Response(
      JSON.stringify({ 
        texts: extractedTexts,
        count: extractedTexts.length 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in comprehensive-text-extract:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function extractAllPageContent(pageComponent: string): Promise<string[]> {
  // This would read actual component files in production
  // For now, we'll simulate comprehensive text extraction
  
  const componentTexts = new Set<string>();
  
  // Get all text content based on component
  const baseTexts = getComponentBaseTexts(pageComponent);
  baseTexts.forEach(text => componentTexts.add(text));
  
  // Add common UI elements found across all pages
  const commonTexts = [
    "Home", "Properties", "About Us", "Contact Us", "Information",
    "Language", "Currency", "Search", "Filter", "Sort",
    "View Details", "Contact Agent", "Learn More", "Get Started",
    "Load More", "Show More", "Previous", "Next", "Back",
    "Submit", "Send", "Save", "Share", "Download", "Print",
    "Login", "Register", "Sign Up", "Sign In", "Logout",
    "Profile", "Settings", "Account", "Dashboard", "Admin",
    "Yes", "No", "Cancel", "OK", "Close", "Open",
    "Price", "Location", "Type", "Size", "Area", "Rooms",
    "Bedrooms", "Bathrooms", "Kitchen", "Living Room",
    "Balcony", "Terrace", "Garden", "Pool", "Parking",
    "Elevator", "Security", "Gym", "Spa", "Beach Access",
    "Sea View", "Mountain View", "City View", "Investment",
    "Rental", "Sale", "Buy", "Rent", "Lease", "Available",
    "Sold", "Reserved", "Coming Soon", "New", "Featured",
    "Premium", "Luxury", "Modern", "Traditional", "Furnished",
    "Unfurnished", "Ready to Move", "Under Construction"
  ];
  
  commonTexts.forEach(text => componentTexts.add(text));
  
  return Array.from(componentTexts).filter(text => 
    text && 
    text.length > 1 && 
    text.length < 500 &&
    !text.includes('function') &&
    !text.includes('import') &&
    !text.includes('export')
  );
}

function getComponentBaseTexts(component: string): string[] {
  const componentMap: { [key: string]: string[] } = {
    'Index': [
      // Hero section
      "Future Homes", "Your Future in Real Estate",
      "Expert guidance for property investment in Turkey and beyond",
      "Find Your Dream Property", "View Properties",
      
      // Search form
      "Buy", "Rent", "Property Type", "Bedrooms", "Property Location", 
      "Reference Number", "Sort By", "Advanced", "Search",
      
      // Before & After section
      "Property", "Before & After",
      "See the transformation of our premium properties",
      
      // Destinations section
      "Explore Destinations", "Discover premium properties in the world's most desirable locations",
      "Antalya", "Turkish Riviera Paradise", "45+ Properties", "View Properties",
      "DUBAI", "CYPRUS", "MERSIN", "ANTALYA",
      "TALK TO AI", "SEE ALL",
      
      // Premium Properties sections
      "Premium Properties", "Discover your dream home from our exclusive collection",
      "Explore our handpicked selection of luxury properties across Turkey, Dubai, and Cyprus.",
      "Each property offers unique features and exceptional value for your investment.",
      "View All Properties", "Premium Properties Worldwide",
      "Explore our carefully curated selection of premium properties",
      
      // Property cards - exact titles from homepage
      "Twin villas with launch price in new project",
      "Luxury apartments with walking distance to the beach",
      "Spacious apartments suitable for investment",
      "Stylish apartments with modern design", 
      "Luxury apartments in magnificent complex",
      "Ready to move-in luxury apartment close to daily amenities",
      
      // Locations from property cards
      "Antalya, Kemer", "Dubai, Marina", "Antalya, Aksu", "Antalya, Altintas",
      "Dubai, Jumeirah Village Circle",
      
      // Property specifications
      "115 m²", "3 bed • 2 bath", "78-1,505 m²", "1-6 bed • 2-7 bath",
      "75-104 m²", "1-2 bed • 1-2 bath", "60-100 m²", "70-112 m²", "72 m²", "1 bed • 1 bath",
      
      // Prices from homepage
      "€350,000", "€1,110,000", "€135,000", "€147,000", "€313,000", "€110,000",
      
      // Testimonials section
      "Testimonials", "What Our Clients Say", "Hear from satisfied property owners worldwide",
      "Real Client Experiences", "Discover how we've helped clients achieve their property investment goals",
      
      // All testimonial quotes (comprehensive list)
      "Thank you for great cooperation. It has been a pleasure getting to know you at Future Homes. Tolga and Ali have been very service-oriented with good communication. Highly recommend!",
      "I bought an apartment through Future Homes with the help of the best Ali. I received wonderful service. Thank you Ali for excellent service and patience.",
      "I bought an apartment through Future Homes with the help of the best Ali. I received wonderful service. Thank you Ali for excellent service and patience. I can warmly recommend buying from Future Homes through Ali.",
      "I wanted to buy a property in Konyaalti when I accidentally came to Future homes and was delighted with their professionalism.",
      "I wanted to buy a property in Konyaalti when I accidentally came to Future homes and was delighted with their professionalism. I think this property is just the beginning of a long-term cooperation with Future homes.",
      "Bought our first apartment in Turkey with Future Homes. Very quick responses to any type of question that we had, everything is explained clearly and thoroughly.",
      "Bought our first apartment in Turkey with Future Homes. Very quick responses to any type of question that we had, everything is explained clearly and thoroughly. Advisor Elena is super knowledgeable, friendly and listened to every need we had.",
      "I am very happy with Ali Karan and Future Homes of the sales I did in Antalya. Definitely recommend this company.",
      "I have a confession to make! I'm the one who gave those guys the hardest time in their career so far. I asked all kinds of questions, made all sorts of changes to the sale contract, and disturbed them even on weekends and holidays. But they handled everything professionally.",
      "Very professional approach. A young company with great ambitions that works hard to ensure the customer goes through a safe real estate transaction.",
      "Very professional approach. A young company with great ambitions that works hard to ensure the customer goes through a safe real estate transaction. They focus on long-term relationships and care about the relationship.",
      "My husband and I have bought 3 apartments from Ali Karan and Future Homes. I am very satisfied with their professional service and the help I got even after the sale was done.",
      "My husband and I have bought 3 apartments from Ali Karan and Future Homes. I am very satisfied with their professional service and the help I got even after the sale was done. I have received my 3 title deeds and I am a happy customer.",
      "The best Ali also helped after I bought an apartment from Future homes. I got help with contact with sellers of appliances, furniture, etc.",
      "The best Ali also helped after I bought an apartment from Future homes. I got help with contact with sellers of appliances, furniture, etc. He was available throughout my stay when I was going to furnish the apartment.",
      "Ali Karan is a man of his words! The energy he has for work and the dedication he gives to his clients is amazing.",
      "Ali Karan is a man of his words! The energy he has for work and the dedication he gives to his clients is amazing. We are always amazed by his efforts! Definitely recommended to everyone.",
      "My brother had purchased a property with this company, and due to his experience and service that he had received, he recommended that I should also purchase.",
      "My brother had purchased a property with this company, and due to his experience and service that he had received, he recommended that I should also purchase as Mr. Karam Ali was very knowledgeable and guided us throughout the process.",
      "We bought an apartment through Future Homes. Wonderful service. Big thanks to everyone in the team, very satisfied! Warmly recommend.",
      "I bought an apartment in Avsallar through Ali. A really nice and helpful guy who obviously can fix everything! Highly recommended.",
      "Tolga was a very professional person who took good care of every single thing to do for this matter and myself. I recommend them strongly.",
      "Very skilled and kind real estate agent, bought apartment through them. If you want to buy an apartment, contact Ali Karan at Future Homes.",
      "I want to thank Future Homes for their incredible help. I would also like to thank the owner (Ali Bey) and his team, Tolga and Bariş, for always being there for me.",
      "I definitely recommend it. I consider myself very lucky that I found this company. I was looking for an apartment in Antalya near the airport.",
      "I definitely recommend it. I consider myself very lucky that I found this company. I was looking for an apartment in Antalya near the airport. The real estate agents Barish and Tolga did their job quickly and carefully.",
      "I felt really good, professional from the beginning and the process was perfect. Buying real estate is a matter of trust, and I found that trust here.",
      "I felt really good, professional from the beginning and the process was perfect. Buying real estate is a matter of trust, and I found that trust here. As a German, I can recommend this company.",
      "Future Homes is an agency that I highly recommend! The advisors are very competent! I particularly want to thank Selen who accompanied us throughout our project.",
      
      // Customer info
      "Cahide Celepli", "Customer - Sweden",
      "Hanan Aldalawi", "Customer - Dubai", 
      "Milan Mitic", "Local Guide - Serbia",
      "Olga", "Local Guide - Sweden",
      "Maher Mare", "Customer - International",
      "Amro", "Pro Fast", "Elham Ahmadi Farsangi",
      "Ib Awn", "Muhammad Umar", "Sushil Ran",
      "Olga Aldabbagh", "Zaid Mohanad", "Dollyz Martinez",
      "Amir Salman", "Cuneyt", "Customer - London",
      "Lena", "Local Guide - Russia", "Jens Zierke",
      "Customer - Germany", "Florence Manga",
      
      // News section
      "News & Insights", "Stay Informed", "Nyheter och insikter",
      "Stay updated with the latest real estate trends and market insights",
      "Property Guide", "Investment", "Bitcoin Property",
      "Dubai Investment", "Dubai Business Guide",
      "Cryptocurrency and property investments",
      "Property investment opportunities in Dubai",
      "Dubai Business Guide: Investment, Real Estate, and Living Abroad Dubai stands as a dynamic global hub, offering immense opportunities for investors, entrepreneurs, and expatriates. This co...",
      "Read More", "View All Articles"
    ],
    
    'AntalyaPropertySearch': [
      // Page header
      "Properties In Antalya", "83 properties found",
      
      // Search filters
      "Property Type", "Any Type", "Bedrooms", "Any", "Location", "Antalya",
      "Min Price", "€0", "Max Price", "€100,000", "Facilities", "Select Facilities",
      "Reference No.", "Reference", "Sort By", "Search", "AI Search", "Timeline View",
      "Showing 83 of 83 properties",
      
      // Property statuses
      "Ready To Move", "Under Construction", "Near the Sea", "For Residence Permit", "Private Pool",
      
      // All property titles from Antalya page
      "Stylish apartments with modern design in Antalya, Aksu",
      "Spacious apartments suitable for investment in Antalya, Aksu",
      "Spacious apartments in a modern designed project in Antalya, Altıntaş",
      "Ready to move-in luxury apartment close to daily amenities in Antalya, Altintas",
      "Stylish apartments with modern design in Antalya, Altintas",
      "Apartments for sale in a project with sea view in Antalya, Altıntaş",
      "Luxury apartments with modern design in Antalya, Altıntaş",
      "Stylish apartments close to public transport in Antalya, Kepez",
      "New apartments in the city center suitable for investment in Antalya, Serik",
      "Stylish apartments with modern design in Antalya, Altintas",
      "Apartments for sale in a modern architectural project in Antalya, Kepez",
      "Luxurious triplex villas in a perfect location in Antalya, Belek",
      "Ultra luxury new villas in nature in Antalya, Konyaaltı",
      "Flats for sale in a modern designed project in Antalya, Altıntaş",
      "Newly completed apartments in the city center of Antalya, Muratpasa",
      "Flats for sale in a newly completed project in Antalya, Kepez",
      "Apartments within walking distance to the sea in Antalya, Finike",
      "Apartments for sale in a luxury project in Antalya, Altintas",
      "Luxury apartments very close to the sea in Antalya, Finike",
      "Stylish apartments in a project with hotel facilities in Antalya, Altintas",
      "High rental income bungalow complex in Antalya, Olympos",
      "Twin villas with launch price in new project in Antalya, Kemer",
      "Luxury apartments with stylish designs in Antalya, Altıntaş",
      "Luxury apartments with modern design in Antalya, Altıntaş",
      "Luxury villas in Antalya, Altıntaş",
      "Ready to move-in apartment with a view in Antalya, Kepez",
      "Hotel rooms for sale with rental guarantee in Antalya, Altintas",
      "Modern apartments in a complex with pool in Antalya, Altintas",
      "Luxury apartments with modern design in Antalya, Altintas",
      "Luxury apartments in a complex with pool in Antalya, Muratpaşa",
      "Apartments in a site with affordable payment options in Antalya, Altintas",
      "Luxurious spacious apartments for sale in Antalya, Konyaaltı",
      "Apartments with high rental income guarantee in the hotel concept project in Antalya, Altıntaş",
      "Spacious apartments with terrace and pool in Antalya, Altıntaş",
      "Ready to move, new apartment in Antalya, Muratpaşa",
      "Stylish apartments in a project suitable for investment in Antalya, Altıntaş",
      "Luxury villas suitable for citizenship in Antalya, Döşemealtı",
      "Luxury apartments for sale with perfect location in Antalya, Muratpasa",
      "New apartments with modern architecture in Antalya, Kepez",
      "Spacious apartments with affordable payment plan in Antalya, Lara",
      "Peaceful, spacious apartments next to nature in Antalya, Dösemealti",
      "Luxury apartments close to daily amenities in Antalya, Konyaaltı",
      "Centrally located modern apartments in Antalya, Altintas",
      "Stylish apartments in a luxury complex for sale in Antalya, Altintas",
      "Apartments in a luxury living center in Antalya, Kepez",
      "Luxury apartments in Antalya, Altintas",
      "Apartments with mountain and forrest view in Antalya, Dösemealti",
      "Duplex apartments with smart home system in Lara, Guzeloba",
      "Modern designed apartments in a secure complex in Antalya, Kepez",
      "Villas with mountain view in Antalya, Konyaalti",
      "Chic real estate with smart home systems in Antalya, Altintas",
      "New apartments close to all daily needs in Antalya, Muratpaşa",
      "Luxury villas in the biggest project of the region in Antalya, Belek",
      "Apartments for sale within the complex in Antalya, Dösemealti",
      "Luxury apartments in a complex with pool in Antalya, Altintas",
      "Apartments in a luxury complex in Antalya, Konyaaltı",
      "Spacious apartments suitable for investment in Antalya, Altintas",
      "Apartments for sale in a luxury complex with pool in Antalya, Kepez",
      "Stunning Flats with Mountain View in Antalya, Konyaaltı",
      "Modern apartments for sale in a residential complex in Antalya, Muratpaşa",
      "Ultra luxury villa in nature with a unique view in Antalya, Geyikbayırı",
      "Luxury apartments for sale in a central location in Antalya, Muratpaşa",
      "Ready to move apartments close to the beach in Antalya, Lara",
      "Flats for sale in a perfect location in Antalya, Muratpasa",
      "Spacious apartments in a project close to the sea in Antalya, Altintas",
      "Twin villas for sale in a luxury complex in Antalya, Altintas",
      "Stylish apartments close to the sea in Antalya, Konyaaltı",
      "Luxury apartments for sale in an excellent location in Antalya, Muratpasa",
      "Spacious flats in a modern designed project in Antalya, Altıntaş",
      "Luxury apartments suitable for investment and citizenship in Antalya, Altintas",
      "Ready to move-in apartments in a boutique apartment building in Antalya, Muratpaşa",
      "Luxury real estate in a complex close to airport in Antalya, Altintas",
      "New apartments suitable for investment in Antalya, Altintas",
      "Apartments with sea, mountain and forest views in Antalya, Kepez",
      "Ready to move-in apartments in a new building in Antalya, Altintas",
      "Apartments for sale in a luxury complex in Antalya, Altintas",
      "Apartments for sale in a stylish project with pool in Antalya, Altıntas",
      "Apartments suitable for citizenship in a stylish project in Antalya, Altintas",
      "Spacious apartments in a boutique project in Antalya, Altintas",
      "Apartments for sale in the best location of the region in Antalya, Altintas",
      "Apartments suitable for investment in a perfect location in Antalya, Kepez",
      "Ready to move-in apartment with unique sea view in Antalya, Konyaaltı",
      "Apartments in a modern designed project in Antalya, Altintas",
      
      // All locations mentioned
      "Antalya, Aksu", "Antalya, Altintas", "Antalya, Kepez", "Antalya, Serik",
      "Antalya, Belek", "Antalya, Konyaalti", "Antalya, Muratpasa", "Antalya, Kemer",
      "Antalya, Olympos", "Antalya, Döşemealtı", "Antalya, Lara", "Antalya, Dösemealti",
      "Lara, Guzeloba", "Antalya, Geyikbayırı", "Antalya, Altıntaş", "Antalya, Muratpaşa",
      "Antalya, Finike",
      
      // Property reference numbers (selection from the page)
      "1278", "1212", "1327", "1381", "1389", "1328", "1398", "1313", "1161", "1395",
      "1276", "1371", "1365", "1353", "1363", "1362", "1285", "1284", "1283", "1281",
      "1271", "1275", "1399", "1396", "1401", "1391", "1393", "1392", "1387", "1384",
      
      // All prices mentioned (selection)
      "€147,000", "€135,000", "€202,000", "€110,000", "€80,000", "€160,000", 
      "€95,000", "€92,500", "€165,000", "€570,000", "€710,000", "€157,500",
      "€120,000", "€148,000", "€200,000", "€1,250,000", "€350,000", "€130,000",
      "€105,000", "€600,000", "€73,000", "€430,000", "€65,000", "€115,000",
      "€119,900", "€198,000", "€177,000", "€155,000", "€140,000", "€150,000",
      "€167,000", "€212,500", "€195,000", "€163,000", "€745,000", "€220,000",
      "€161,000", "€152,000", "€192,000", "€213,000", "€790,000", "€129,000",
      "€1,196,000", "€378,000", "€64,000", "€90,000", "€193,000", "€199,000",
      "€133,000", "€170,000", "€100,000", "€112,500", "€167,500", "€180,000",
      "€179,000", "€315,000",
      
      // Property specifications patterns
      "1+1 <> 2+1", "1 <> 2", "60 <> 100", "75 <> 104", "2+1 <> 3+1", "85 <> 120",
      "1+1", "72", "1+ <> 4+1", "30 <> 130", "1+1 <> 5+1", "1 <> 3", "46 <> 314",
      "53 <> 84", "1+ <> 1+1", "35 <> 47", "45 <> 182", "105 <> 145", "43 <> 106",
      "4+1", "280", "5+1", "270", "45 <> 103", "80 <> 180", "180", "2+1", "68",
      "91", "71", "80", "30", "3+1", "115", "55 <> 83", "40", "3+2", "1+", "28",
      "45 <> 74", "50 <> 94", "53 <> 74", "76 <> 91", "44", "45 <> 65", "100",
      "45 <> 64", "170 <> 248", "3 <> 5", "83", "65 <> 133", "100 <> 125", "175",
      "74", "48", "63 <> 201", "70 <> 222", "106 <> 180", "59", "320", "58 <> 135",
      "160 <> 200", "2 <> 3", "50 <> 130", "60 <> 144", "72 <> 92", "67", "87 <> 140",
      "167 <> 170", "300", "70 <> 160", "36", "63", "347", "100 <> 177", "45 <> 130",
      "58", "52 <> 131", "60 <> 125", "93 <> 156", "63 <> 95", "82 <> 126", "50 <> 95",
      "60 <> 100", "55 <> 82", "42 <> 140", "56 <> 75", "90 <> 137", "55", "105"
    ],
    
    'AboutUs': [
      "About Future Homes", "Your Future Real Estate Partner",
      "Meet Our Team", "Our experienced professionals are here to guide you through your property journey",
      "WE ARE WITH YOU BEFORE AND AFTER SALES", "Comprehensive services throughout your property journey",
      
      // Team roles
      "Founder", "Business Developer", "General Manager", "Portfolio Manager",
      "Sales Office Supervisor", "Portfolio Supervisor", "Dubai Office Manager", "Real Estate Consultant",
      
      // Team members
      "Ali Karan", "Cem Çakıroğlu", "Tolga Çakıroğlu", "Özgün Baykal",
      "Ervina Köksel", "Fırat Ine", "Umar", "Kim Larsson", "Batuhan Kunt",
      
      // Services
      "FREE PROPERTY VISITS", "We organize free property visits for our clients",
      "SALES CONTRACT", "Professional sales contract preparation",
      "GET YOUR TAX NUMBER", "Assistance with tax number application",
      "OPEN A BANK ACCOUNT", "Help with bank account opening",
      "TRANSLATIONS OF DOCUMENTS", "Professional document translation services",
      "RECEIVE YOUR TITLE DEED", "Complete title deed transfer process",
      "SERVICES SUBSCRIPTIONS", "Utility and service connections",
      "FURNITURE TOUR", "Professional furniture selection tours",
      "SELL YOUR PROPERTY", "Property resale assistance",
      
      // Languages
      "OUR TEAM SPEAKS 9 DIFFERENT LANGUAGES",
      "To achieve this, we have a strong team behind us who speak multiple languages fluently.",
      "Norwegian", "Swedish", "English", "Russian", "French", "Arabic", "Farsi", "German", "Urdu",
      
      // Values
      "Our Values", "Ethics", "Professionalism", "Transparency",
      "We conduct business with the highest ethical standards",
      "Professional service in every aspect of our work",
      "Complete transparency in all our dealings",
      
      // Locations
      "Future Homes Locations", "Where can you find real estate with Future Homes?",
      "Turkey", "Antalya, Mersin", , "Dubai"
    ]
  };
  
  return componentMap[component] || [];
}