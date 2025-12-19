import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  property?: string;
  message?: string;
  source?: 'contact-form' | 'ai-chat' | 'property-wizard';
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

    // Generate email content based on source
    const name = formData.name || `${formData.firstName || ''} ${formData.lastName || ''}`.trim();
    const sourceLabels: Record<string, string> = {
      'contact-form': 'Contact Form',
      'ai-chat': 'AI Help Chat',
      'property-wizard': 'Property Search Wizard'
    };
    const sourceLabel = sourceLabels[formData.source] || 'Website';

    let emailContent = `
      <h2>New Contact Inquiry from Website</h2>
      <p><strong>Source:</strong> ${sourceLabel}</p>
      <p><strong>Name:</strong> ${name || 'Not provided'}</p>
      <p><strong>Email:</strong> ${formData.email || 'Not provided'}</p>
      <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
    `;

    // Add property-specific content for contact form
    if (formData.source === 'contact-form' && formData.property) {
      emailContent += `<p><strong>Property Interest:</strong> ${formData.property}</p>`;
    }

    // Add message for contact form
    if (formData.message) {
      emailContent += `
        <p><strong>Message:</strong></p>
        <p>${formData.message}</p>
      `;
    }

    // Add property search selections for wizard
    if (formData.source === 'property-wizard' && formData.selections) {
      emailContent += `
        <h3>Property Search Preferences:</h3>
        <p><strong>Location:</strong> ${formData.selections.location || 'Not specified'}</p>
        <p><strong>Property Type:</strong> ${formData.selections.propertyType || 'Not specified'}</p>
        <p><strong>Budget:</strong> ${formData.selections.budget || 'Not specified'}</p>
        <p><strong>Features:</strong> ${formData.selections.features?.join(', ') || 'Not specified'}</p>
      `;
    }

    emailContent += `
      <hr>
      <p><em>This message was sent from ${sourceLabel} on Future Homes International website.</em></p>
    `;

    const emailResponse = await resend.emails.send({
      from: "Future Homes International <onboarding@resend.dev>",
      to: ["info@futurehomesinternational.com"],
      replyTo: formData.email || undefined,
      subject: `New Contact Inquiry from ${name || 'Website Visitor'}`,
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