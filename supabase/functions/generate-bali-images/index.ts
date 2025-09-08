import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Define the Bali articles with their prompts
    const baliArticles = [
      {
        slug: 'bali-real-estate-investment-complete-guide',
        prompt: 'Professional real estate photo of luxury Bali villa with infinity pool overlooking tropical landscape, modern architecture, investment property, high-end photography, golden hour lighting, ultra high resolution'
      },
      {
        slug: 'top-5-bali-neighborhoods-property-investment-2025',
        prompt: 'Aerial view of premium Bali neighborhoods showing luxury villas, beachfront properties, lush tropical landscape, Seminyak and Canggu areas, property investment aerial photography, ultra high resolution'
      },
      {
        slug: 'bali-villa-rental-business-maximize-investment-returns',
        prompt: 'Luxury Bali villa rental property with private pool, tropical garden, modern outdoor living space, hospitality photography, villa management business, premium accommodation, ultra high resolution'
      },
      {
        slug: 'legal-guide-foreign-property-ownership-bali-indonesia',
        prompt: 'Professional legal consultation setting in modern Bali office, Indonesian property documents, legal advisor meeting, clean modern architecture, business photography, ultra high resolution'
      },
      {
        slug: 'bali-lifestyle-why-international-buyers-choose-island-gods',
        prompt: 'Beautiful Bali lifestyle scene with traditional architecture, rice terraces, tropical paradise living, expat community, cultural harmony, lifestyle photography, ultra high resolution'
      }
    ];

    const results = [];

    for (const article of baliArticles) {
      console.log(`Generating image for: ${article.slug}`);

      // Generate image with OpenAI
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-image-1',
          prompt: article.prompt,
          size: '1024x1024',
          quality: 'high',
          output_format: 'webp',
          n: 1
        }),
      });

      if (!response.ok) {
        console.error(`Failed to generate image for ${article.slug}:`, await response.text());
        continue;
      }

      const imageData = await response.json();
      
      if (imageData.data && imageData.data[0]) {
        // OpenAI gpt-image-1 returns base64 data
        const base64Data = imageData.data[0].b64_json;
        const imageUrl = `data:image/webp;base64,${base64Data}`;

        // Update the blog post with the generated image
        const { error } = await supabase
          .from('blog_posts')
          .update({ 
            featured_image: imageUrl
          })
          .eq('slug', article.slug);

        if (error) {
          console.error(`Failed to update blog post ${article.slug}:`, error);
          results.push({
            slug: article.slug,
            success: false,
            error: error.message
          });
        } else {
          console.log(`Successfully updated image for ${article.slug}`);
          results.push({
            slug: article.slug,
            success: true,
            imageUrl: imageUrl
          });
        }
      }
    }

    return new Response(JSON.stringify({ 
      message: 'Bali article images generated successfully',
      results 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating Bali images:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});