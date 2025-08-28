import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false',
  'Vary': 'Origin, Access-Control-Request-Method, Access-Control-Request-Headers',
  'Access-Control-Expose-Headers': 'Content-Length, Content-Type'
};

// Swedish language keywords for proper detection
const swedishWords = ['är', 'jag', 'du', 'han', 'hon', 'vi', 'de', 'det', 'den', 'ett', 'en', 'och', 'i', 'på', 'av', 'till', 'från', 'med', 'för', 'som', 'att', 'var', 'vad', 'när', 'hur', 'varför', 'kan', 'ska', 'vill', 'kommer', 'får', 'har', 'hade', 'skulle', 'måste', 'bör', 'denna', 'detta', 'dessa', 'den', 'det', 'sig', 'sina', 'sitt'];
const swedishPropertyWords = ['bostad', 'lägenhet', 'hus', 'villa', 'fastighet', 'köpa', 'rum', 'sovrum', 'badrum', 'kök', 'balkong', 'terrass', 'pris', 'kostnad', 'kvm', 'yta', 'investering', 'semester', 'billig', 'dyr', 'nära', 'strand', 'centrum'];

// English language keywords for detection
const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'over', 'after', 'beneath', 'under', 'above', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'];
const englishPropertyWords = ['property', 'properties', 'apartment', 'house', 'villa', 'home', 'buy', 'purchase', 'bedroom', 'bathroom', 'kitchen', 'balcony', 'terrace', 'price', 'cost', 'euro', 'investment', 'vacation', 'cheap', 'expensive', 'near', 'beach', 'center'];

// Language detection function
const detectLanguage = (text: string): string => {
  const words = text.toLowerCase().split(/\s+/);
  
  // Count Swedish indicators
  const swedishGeneralCount = words.filter(word => 
    swedishWords.some(swWord => word === swWord)
  ).length;
  const swedishPropertyCount = words.filter(word => 
    swedishPropertyWords.some(swWord => word.includes(swWord))
  ).length;
  
  // Count English indicators
  const englishGeneralCount = words.filter(word => 
    englishWords.some(enWord => word === enWord)
  ).length;
  const englishPropertyCount = words.filter(word => 
    englishPropertyWords.some(enWord => word.includes(enWord))
  ).length;
  
  const totalSwedishScore = swedishGeneralCount + swedishPropertyCount;
  const totalEnglishScore = englishGeneralCount + englishPropertyCount;
  
  // Default to English if no clear indicators
  if (totalSwedishScore === 0 && totalEnglishScore === 0) {
    return 'en';
  }
  
  return totalSwedishScore > totalEnglishScore ? 'sv' : 'en';
};

// Extract number from string
const extractNumber = (value: string | null): number | undefined => {
  if (!value) return undefined;
  const match = value.match(/\d+/);
  return match ? parseInt(match[0]) : undefined;
};

const searchProperties = async (query: string, detectedLanguage: string) => {
  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl!, supabaseKey!);
    
    // Get all properties from database
    const { data: allProperties, error } = await supabase
      .from('properties')
      .select('*')
      .limit(200);
    
    if (error) {
      console.error('Error fetching properties:', error);
      return [];
    }
    
    if (!allProperties || allProperties.length === 0) {
      console.log('No properties found in database');
      return [];
    }
    
    console.log(`Found ${allProperties.length} properties in database`);
    
    // Convert database properties to our format and validate
    const formattedProperties = allProperties.map(prop => {
      const hasValidId = prop.id && prop.id.toString().length > 0;
      const hasValidTitle = prop.title && prop.title.trim().length > 0;
      const hasValidLocation = prop.location && prop.location.trim().length > 0;
      const hasValidImage = prop.property_image || (prop.property_images && prop.property_images[0]);
      
      if (!hasValidId || !hasValidTitle || !hasValidLocation || !hasValidImage) {
        return null;
      }
      
      return {
        id: prop.id,
        title: prop.title,
        price: prop.price || prop.starting_price_eur || '€N/A',
        location: prop.location,
        image: prop.property_image || (prop.property_images && prop.property_images[0]),
        bedrooms: extractNumber(prop.bedrooms),
        bathrooms: extractNumber(prop.bathrooms),
        area: extractNumber(prop.sizes_m2),
        description: prop.description || '',
        facilities: prop.facilities || '',
        ref_no: prop.ref_no || '',
        property_type: prop.property_type || '',
        distance_to_beach: prop.distance_to_beach_km || '',
        distance_to_airport: prop.distance_to_airport_km || ''
      };
    }).filter(prop => prop !== null);
    
    // Advanced filtering based on query with better understanding
    const queryLower = query.toLowerCase();
    let filteredProperties = formattedProperties;

    // Extract price range from query
    const priceMatches = query.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:k|000|thousand|tusen)/gi);
    const eurMatches = query.match(/€\s*(\d+(?:,\d+)*(?:\.\d+)?)/gi);
    
    let minPrice = 0;
    let maxPrice = Infinity;
    
    // Parse price requirements
    if (priceMatches) {
      const prices = priceMatches.map(match => {
        const num = match.replace(/[^\d.]/g, '');
        return parseFloat(num) * (match.toLowerCase().includes('k') || match.toLowerCase().includes('000') || match.toLowerCase().includes('thousand') || match.toLowerCase().includes('tusen') ? 1000 : 1);
      });
      if (prices.length === 1) {
        maxPrice = prices[0];
      } else if (prices.length >= 2) {
        minPrice = Math.min(...prices);
        maxPrice = Math.max(...prices);
      }
    }
    
    if (eurMatches) {
      const prices = eurMatches.map(match => {
        const num = match.replace(/[€\s,]/g, '');
        return parseFloat(num);
      });
      if (prices.length === 1) {
        maxPrice = prices[0];
      } else if (prices.length >= 2) {
        minPrice = Math.min(...prices);
        maxPrice = Math.max(...prices);
      }
    }

    // Location-based filtering with better matching
    if (queryLower.includes('antalya') || queryLower.includes('aksu') || queryLower.includes('altintas') || queryLower.includes('lara') || queryLower.includes('kepez') || queryLower.includes('konyaalti')) {
      filteredProperties = formattedProperties.filter(p => p.location.toLowerCase().includes('antalya'));
    } else if (queryLower.includes('dubai') || queryLower.includes('marina') || queryLower.includes('jumeirah') || queryLower.includes('downtown') || queryLower.includes('studio city') || queryLower.includes('meydan')) {
      filteredProperties = formattedProperties.filter(p => p.location.toLowerCase().includes('dubai'));
    } else if (queryLower.includes('mersin') || queryLower.includes('erdemli') || queryLower.includes('tarsus')) {
      filteredProperties = formattedProperties.filter(p => p.location.toLowerCase().includes('mersin'));
    } else if (queryLower.includes('cyprus') || queryLower.includes('cypern') || queryLower.includes('esentepe') || queryLower.includes('tatlısu')) {
      filteredProperties = formattedProperties.filter(p => p.location.toLowerCase().includes('cyprus'));
    }

    // Bedroom filtering with better recognition
    const bedroomPattern = /(\d+)\s*(?:bedroom|sovrum|rum|\+1)/gi;
    const bedroomMatches = query.match(bedroomPattern);
    if (bedroomMatches) {
      const bedroomCount = parseInt(bedroomMatches[0].match(/\d+/)[0]);
      filteredProperties = filteredProperties.filter(p => p.bedrooms === bedroomCount);
    } else if (queryLower.includes('1 bedroom') || queryLower.includes('1 rum') || queryLower.includes('1+1')) {
      filteredProperties = filteredProperties.filter(p => p.bedrooms === 1);
    } else if (queryLower.includes('2 bedroom') || queryLower.includes('2 rum') || queryLower.includes('2+1')) {
      filteredProperties = filteredProperties.filter(p => p.bedrooms === 2);
    } else if (queryLower.includes('3 bedroom') || queryLower.includes('3 rum') || queryLower.includes('3+1')) {
      filteredProperties = filteredProperties.filter(p => p.bedrooms === 3);
    } else if (queryLower.includes('4 bedroom') || queryLower.includes('4 rum') || queryLower.includes('4+1')) {
      filteredProperties = filteredProperties.filter(p => p.bedrooms === 4);
    }

    // Price filtering with extracted ranges or keywords
    if (minPrice > 0 || maxPrice < Infinity) {
      filteredProperties = filteredProperties.filter(p => {
        const priceMatch = p.price.match(/[\d,]+/);
        if (priceMatch) {
          const price = parseInt(priceMatch[0].replace(/,/g, ''));
          return price >= minPrice && price <= maxPrice;
        }
        return false;
      });
    } else if (queryLower.includes('budget') || queryLower.includes('cheap') || queryLower.includes('billig') || queryLower.includes('under 200') || queryLower.includes('under 200k')) {
      filteredProperties = filteredProperties.filter(p => {
        const priceMatch = p.price.match(/[\d,]+/);
        if (priceMatch) {
          const price = parseInt(priceMatch[0].replace(/,/g, ''));
          return price < 200000;
        }
        return false;
      });
    } else if (queryLower.includes('luxury') || queryLower.includes('exclusive') || queryLower.includes('lyx') || queryLower.includes('premium') || queryLower.includes('high-end')) {
      filteredProperties = filteredProperties.filter(p => {
        const priceMatch = p.price.match(/[\d,]+/);
        if (priceMatch) {
          const price = parseInt(priceMatch[0].replace(/,/g, ''));
          return price > 400000;
        }
        return false;
      });
    }

    // Property type filtering with better recognition
    if (queryLower.includes('apartment') || queryLower.includes('lägenhet') || queryLower.includes('flat')) {
      filteredProperties = filteredProperties.filter(p => 
        p.property_type.toLowerCase().includes('apartment') || 
        p.title.toLowerCase().includes('apartment')
      );
    } else if (queryLower.includes('villa') || queryLower.includes('house') || queryLower.includes('hus')) {
      filteredProperties = filteredProperties.filter(p => 
        p.property_type.toLowerCase().includes('villa') || 
        p.title.toLowerCase().includes('villa') ||
        p.title.toLowerCase().includes('house')
      );
    }

    // Special features filtering
    if (queryLower.includes('sea view') || queryLower.includes('havsutsikt') || queryLower.includes('ocean view')) {
      filteredProperties = filteredProperties.filter(p => 
        p.description.toLowerCase().includes('sea') || 
        p.description.toLowerCase().includes('ocean') ||
        p.facilities.toLowerCase().includes('sea')
      );
    }

    if (queryLower.includes('pool') || queryLower.includes('swimming') || queryLower.includes('pool')) {
      filteredProperties = filteredProperties.filter(p => 
        p.facilities.toLowerCase().includes('pool') ||
        p.description.toLowerCase().includes('pool')
      );
    }

    // Only return properties if filters match - don't show random properties
    if (filteredProperties.length === 0) {
      console.log('No properties match the criteria');
      return [];
    }

    // Randomize and limit results to show variety
    const shuffled = filteredProperties.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(6, filteredProperties.length));
    
  } catch (error) {
    console.error('Error in searchProperties:', error);
    return [];
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [], conversationId } = await req.json();
    
    console.log('Received message:', message);
    console.log('Conversation ID:', conversationId);
    console.log('History length:', conversationHistory.length);

    const detectedLanguage = detectLanguage(message);
    console.log('Detected language:', detectedLanguage);

// Enhanced system prompt with comprehensive property database knowledge
    const systemPrompt = detectedLanguage === 'sv' ? 
      `Du är en expert AI-assistent för Future Homes Turkey med fullständig kunskap om ALLA våra fastigheter. Du har tränade på hela vår databas med exakta fastighetsdetaljer.

FASTIGHETSPORTFÖLJ (KOMPLETT DATABAS):

ANTALYA - 67 FASTIGHETER:
• Aksu: Moderna lägenheter €135,000-€280,000, 1+1 till 3+1, färdiga och under konstruktion
• Altintas: Lyxkomplex €110,000-€280,000, nära flygplats (3-4km), strand (4-8km)
• Kepez: Investeringslägenheter €170,000-€450,000, olika storlekar
• Lara: Lyxprojekt nära Lara Beach €200,000-€350,000
• Konyaalti: Havsnära fastigheter €180,000-€320,000

DUBAI - 22 FASTIGHETER:
• Marina: Ultra-lyx €815,000-€1,675,000, havsutsikt, 1+1 till 6+1
• Jumeirah Village Circle: €313,000-€485,000, moderna komplex
• Studio City: €255,000-€310,000, investeringsmöjligheter
• Downtown: €605,000+, exklusiva lägen
• Meydan: €311,000-€402,000, hästkapplöpningsbana närhet
• Motor City: €242,000-€250,000, familjevänliga områden

CYPERN - 29+ FASTIGHETER:
• Esentepe: €420,000+, havsutsikt, under konstruktion
• Tatlısu: €600,000+, havsnära, moderna design

MERSIN - 61 FASTIGHETER:
• Marina District: €150,000-€350,000, moderna villkomplex
• Erdemli: €160,000-€280,000, havsnära projekt
• Varierad portfölj från 1+1 till 4+1

RIKTLINJER:
- Svara ENDAST på svenska
- Visa BARA fastigheter som VERKLIGEN FINNS i vår databas
- Matcha användarens EXAKTA kriterier (budget, rum, läge)
- Ge VERKLIGA fastighets-IDs, priser och detaljer
- Om ingen fastighet matchar, säg det ärligt
- Var SPECIFIK med referensnummer och exakta priser

FÖRSTA MEDDELANDE: "Hej! Jag känner till alla våra 180+ fastigheter i detalj. Vad letar du efter specifikt - budget, antal rum, läge?"

Visa ALDRIG icke-existerande fastigheter. Använd ENDAST ovanstående verkliga data.`
    :
      `You are an expert AI assistant for Future Homes Turkey with complete knowledge of ALL our properties. You've been trained on our entire database with exact property details.

PROPERTY PORTFOLIO (COMPLETE DATABASE):

ANTALYA - 67 PROPERTIES:
• Aksu: Modern apartments €135,000-€280,000, 1+1 to 3+1, ready and under construction
• Altintas: Luxury complexes €110,000-€280,000, near airport (3-4km), beach (4-8km)
• Kepez: Investment apartments €170,000-€450,000, various sizes
• Lara: Luxury projects near Lara Beach €200,000-€350,000
• Konyaalti: Beachfront properties €180,000-€320,000

DUBAI - 22 PROPERTIES:
• Marina: Ultra-luxury €815,000-€1,675,000, sea view, 1+1 to 6+1
• Jumeirah Village Circle: €313,000-€485,000, modern complexes
• Studio City: €255,000-€310,000, investment opportunities
• Downtown: €605,000+, exclusive locations
• Meydan: €311,000-€402,000, racecourse proximity
• Motor City: €242,000-€250,000, family-friendly areas

CYPRUS - 29+ PROPERTIES:
• Esentepe: €420,000+, sea view, under construction
• Tatlısu: €600,000+, seaside, modern design

MERSIN - 61 PROPERTIES:
• Marina District: €150,000-€350,000, modern villa complexes
• Erdemli: €160,000-€280,000, seaside projects
• Varied portfolio from 1+1 to 4+1

GUIDELINES:
- Respond ONLY in English
- Show ONLY properties that ACTUALLY EXIST in our database
- Match user's EXACT criteria (budget, rooms, location)
- Provide REAL property IDs, prices and details
- If no property matches, say so honestly
- Be SPECIFIC with reference numbers and exact prices

FIRST MESSAGE: "Hello! I know all our 180+ properties in detail. What are you looking for specifically - budget, room count, location?"

NEVER show non-existent properties. Use ONLY the real data above.`;

    const messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    // Add conversation history
    conversationHistory.forEach((msg: any) => {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      });
    });

    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.choices[0].message.content;
    
    // Remove markdown characters like * and # from the response
    aiResponse = aiResponse.replace(/[*#]/g, '');

    console.log('AI Response:', aiResponse);

    // Check if user is asking about properties and search database
    const propertyKeywords = ['property', 'properties', 'apartment', 'villa', 'house', 'home', 'buy', 'purchase', 'invest', 'price', 'bedroom', 'bathroom', 'antalya', 'dubai', 'cyprus', 'mersin', 'bostad', 'lägenhet', 'lägenheter', 'hus', 'villa', 'fastighet', 'fastigheter', 'köpa', 'pris', 'sovrum', 'badrum'];
    
    const isPropertyQuery = propertyKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );

    let propertyLinks = [];
    if (isPropertyQuery) {
      console.log('Property query detected, searching database...');
      propertyLinks = await searchProperties(message, detectedLanguage);
      console.log('Found property links:', propertyLinks.length);
    }

    return new Response(JSON.stringify({
      response: aiResponse,
      propertyLinks: propertyLinks,
      detectedLanguage: detectedLanguage
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({
      error: 'An error occurred while processing your request',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});