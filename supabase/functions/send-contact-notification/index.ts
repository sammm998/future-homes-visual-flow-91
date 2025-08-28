import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Input validation helpers
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[\s\.\-\(\)]?[\d\s\.\-\(\)]{10,20}$/;
  return phoneRegex.test(phone);
};

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<[^>]*>/g, '').substring(0, 1000);
};

const isValidName = (name: string): boolean => {
  return name.length >= 1 && name.length <= 100 && !/[<>{}]/.test(name);
};

interface ContactFormData {
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone: string;
  property?: string;
  message?: string;
  source: 'contact-form' | 'ai-chat' | 'property-wizard';
  selections?: {
    location?: string;
    propertyType?: string;
    budget?: string;
    features?: string[];
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactFormData = await req.json();
    console.log("Received contact form data:", formData);

    // Security: Validate required fields
    if (!formData.email || !isValidEmail(formData.email)) {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!formData.phone || !isValidPhone(formData.phone)) {
      return new Response(
        JSON.stringify({ error: "Valid phone number is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Security: Validate source
    if (!['contact-form', 'ai-chat', 'property-wizard'].includes(formData.source)) {
      return new Response(
        JSON.stringify({ error: "Invalid source" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Security: Sanitize all text inputs
    const name = formData.name || `${formData.firstName || ''} ${formData.lastName || ''}`.trim();
    
    if (name && !isValidName(name)) {
      return new Response(
        JSON.stringify({ error: "Invalid name format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(formData.email);
    const sanitizedPhone = sanitizeInput(formData.phone);
    const sanitizedMessage = formData.message ? sanitizeInput(formData.message) : '';
    const sanitizedProperty = formData.property ? sanitizeInput(formData.property) : '';

    // Generate email content based on source with sanitized data
    const sourceLabels = {
      'contact-form': 'Contact Form',
      'ai-chat': 'AI Help Chat',
      'property-wizard': 'Property Search Wizard'
    };

    let emailContent = `
      <h2>New Contact Inquiry from Website</h2>
      <p><strong>Source:</strong> ${sourceLabels[formData.source]}</p>
      <p><strong>Name:</strong> ${sanitizedName}</p>
      <p><strong>Email:</strong> ${sanitizedEmail}</p>
      <p><strong>Phone:</strong> ${sanitizedPhone}</p>
    `;

    // Add property-specific content for contact form
    if (formData.source === 'contact-form' && sanitizedProperty) {
      emailContent += `<p><strong>Property Interest:</strong> ${sanitizedProperty}</p>`;
    }

    // Add message for contact form
    if (sanitizedMessage) {
      emailContent += `
        <p><strong>Message:</strong></p>
        <p>${sanitizedMessage}</p>
      `;
    }

    // Add property search selections for wizard (with sanitization)
    if (formData.source === 'property-wizard' && formData.selections) {
      const selections = formData.selections;
      emailContent += `
        <h3>Property Search Preferences:</h3>
        <p><strong>Location:</strong> ${selections.location ? sanitizeInput(selections.location) : 'Not specified'}</p>
        <p><strong>Property Type:</strong> ${selections.propertyType ? sanitizeInput(selections.propertyType) : 'Not specified'}</p>
        <p><strong>Budget:</strong> ${selections.budget ? sanitizeInput(selections.budget) : 'Not specified'}</p>
        <p><strong>Features:</strong> ${selections.features?.map(f => sanitizeInput(f)).join(', ') || 'Not specified'}</p>
      `;
    }

    emailContent += `
      <hr>
      <p><em>This message was sent from ${sourceLabels[formData.source]} on Future Homes Turkey website.</em></p>
    `;

    const emailResponse = await resend.emails.send({
      from: "Future Homes Turkey <info@futurehomesturkey.com>",
      to: ["info@futurehomesturkey.com"],
      subject: `New Contact Inquiry from ${sanitizedName}`,
      html: emailContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);