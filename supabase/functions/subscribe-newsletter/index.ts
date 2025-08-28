import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-requested-with",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Max-Age": "86400",
  "Access-Control-Allow-Credentials": "false"
};

// Input validation helpers
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254 && email.length >= 5;
};

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<[^>]*>/g, '').substring(0, 254);
};

interface NewsletterSubscriptionRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    const { email }: NewsletterSubscriptionRequest = await req.json();

    // Security: Validate email format and length
    if (!email || !isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Valid email address is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Security: Sanitize email input
    const sanitizedEmail = sanitizeInput(email);

    // Send notification email to info@futurehomesturkey.com
    const emailResponse = await resend.emails.send({
      from: "Future Homes Turkey <info@futurehomesturkey.com>",
      to: ["info@futurehomesturkey.com"],
      subject: "New Newsletter Subscription",
      html: `
        <h1>New Newsletter Subscriber</h1>
        <p>A new user has subscribed to your newsletter:</p>
        <p><strong>Email:</strong> ${sanitizedEmail}</p>
        <p><strong>Subscription Date:</strong> ${new Date().toLocaleString()}</p>
        <br>
        <p>Best regards,<br>Future Homes Turkey Website</p>
      `,
    });

    console.log("Notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in subscribe-newsletter function:", error);
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