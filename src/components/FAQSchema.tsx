import React from 'react';
import { SEOSchemaGenerator } from './SEOSchemaGenerator';

export const FAQSchema: React.FC = () => {
  const faqs = [
    {
      question: "Vad kostar det att köpa lägenhet i Turkiet?",
      answer: "Priserna för lägenheter i Turkiet börjar från €190,000. Priset varierar beroende på plats, storlek och faciliteter. Antalya och Istanbul är populära områden med olika prisnivåer."
    },
    {
      question: "Kan jag få turkiskt medborgarskap genom att köpa fastighet?",
      answer: "Ja, du kan ansöka om turkiskt medborgarskap genom att investera minst $400,000 i turkisk fastighet. Vi hjälper dig genom hela processen från fastighetsköp till medborgarskapsansökan."
    },
    {
      question: "Vilka områden rekommenderar ni för fastighetsinvestering?",
      answer: "Vi rekommenderar Antalya, Istanbul, Bodrum och Kusadasi för fastighetsinvestering. Dessa områden har stark tillväxt, god infrastruktur och hög efterfrågan på hyresmarknaden."
    },
    {
      question: "Hur lång tid tar det att köpa fastighet i Turkiet?",
      answer: "Processen tar vanligtvis 2-4 veckor från att du hittat rätt fastighet. Vi hjälper dig med alla juridiska steg, dokumentation och överföring av äganderätt."
    },
    {
      question: "Kan utländska medborgare köpa fastighet i Turkiet?",
      answer: "Ja, utländska medborgare kan köpa fastighet i Turkiet enligt turkisk lag. Det finns vissa begränsningar gällande område och antal fastigheter, men vi guidar dig genom regelverket."
    },
    {
      question: "Vilka ytterligare kostnader finns utöver fastighetspriset?",
      answer: "Utöver fastighetspriset tillkommer kostnader för juridisk rådgivning, registreringsavgifter, skatter och eventuella renoveringar. Vi ger dig en transparent kostnadsöversikt innan köp."
    },
    {
      question: "Erbjuder ni fastigheter i andra länder än Turkiet?",
      answer: "Ja, vi erbjuder även fastigheter i Dubai, Cypern och Frankrike. Varje marknad har sina unika fördelar och investeringsmöjligheter som vi kan hjälpa dig att utforska."
    },
    {
      question: "Kan jag finansiera fastighetsköpet?",
      answer: "Ja, vi kan hjälpa dig med finansieringsalternativ både från turkiska banker och internationella låneinstitut. Villkoren varierar beroende på din situation och den valda fastigheten."
    }
  ];

  return <SEOSchemaGenerator type="faq" faqs={faqs} />;
};

export default FAQSchema;