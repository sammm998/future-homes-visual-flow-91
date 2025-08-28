import React from 'react';
import Navigation from "@/components/Navigation";
import { FocusCards } from "@/components/ui/focus-cards";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { t } from "@/utils/translations";
import { useSearchParams } from "react-router-dom";

// Import local testimonial images
import turgutImg from "@/assets/testimonials/turgut.jpg";
import yuriiGlushkovImg from "@/assets/testimonials/yurii-glushkov.jpg";
import olgaImg from "@/assets/testimonials/olga.jpg";
import tahirImg from "@/assets/testimonials/tahir.jpg";
import pekerImg from "@/assets/testimonials/peker.jpg";
import oksanaImg from "@/assets/testimonials/oksana.jpg";
import zaidImg from "@/assets/testimonials/zaid.jpg";
import kharonImg from "@/assets/testimonials/kharon.jpg";
import poliakovImg from "@/assets/testimonials/poliakov.jpg";
import magomedImg from '@/assets/testimonials/magomed.jpg';
import nikolausImg from '@/assets/testimonials/nikolaus.jpg';
import vicdanImg from '@/assets/testimonials/vicdan.jpg';
import maherImg from '@/assets/testimonials/maher.jpg';


interface DbTestimonial {
  id: string;
  customer_name: string;
  customer_country?: string;
  review_text: string;
  rating?: number;
  property_type?: string;
  location?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

interface CardTestimonial extends DbTestimonial {
  title: string;
  src: string;
}

// Map of customer names to local images
const localImageMap: Record<string, string> = {
  "Turgut": turgutImg,
  "Yurii Glushkov": yuriiGlushkovImg,
  "Olga": olgaImg,
  "Tahir": tahirImg,
  "Peker": pekerImg,
  "Oksana": oksanaImg,
  "Zaid": zaidImg,
  "Kharon": kharonImg,
  "Poliakov": poliakovImg,
  "Magomed and Asetta": magomedImg,
  "Haron and Larisa": magomedImg,
  "Nikolaus": nikolausImg,
  "Vicdan": vicdanImg,
  "Maher Loul": maherImg,
};

const Testimonials = () => {
  const [searchParams] = useSearchParams();
  const language = searchParams.get('lang') || 'en';
  const [selectedTestimonial, setSelectedTestimonial] = useState<CardTestimonial | null>(null);
  const [testimonials, setTestimonials] = useState<CardTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching testimonials:', error);
        return;
      }

      if (data) {
        // Transform data to match FocusCards expected format
        const transformedData: CardTestimonial[] = data.map((testimonial: DbTestimonial) => ({
          ...testimonial,
          title: testimonial.customer_name,
          src: localImageMap[testimonial.customer_name] || testimonial.image_url || '/placeholder.svg'
        }));
        setTestimonials(transformedData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Refresh data when component becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchTestimonials();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleCardClick = (card: any) => {
    setSelectedTestimonial(card as CardTestimonial);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading testimonials...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('testimonials.title', language)}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('testimonials.subtitle', language)}
            </p>
          </div>

          {testimonials.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No testimonials available yet.</p>
            </div>
          ) : (
            <FocusCards cards={testimonials} onCardClick={handleCardClick} />
          )}
        </div>
      </main>

      <Dialog open={!!selectedTestimonial} onOpenChange={() => setSelectedTestimonial(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedTestimonial?.customer_name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="relative max-h-[70vh] overflow-hidden rounded-lg">
              <img
                src={selectedTestimonial?.src || "/placeholder.svg"}
                alt={selectedTestimonial?.customer_name || "Customer"}
                className="w-full h-auto object-contain max-h-[70vh]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>
            
            {selectedTestimonial?.customer_country && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Country</h3>
                <p className="text-muted-foreground">{selectedTestimonial.customer_country}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Testimonial</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {selectedTestimonial?.review_text || "No testimonial text available"}
                </p>
              </div>
              
              {selectedTestimonial?.location && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Location</h3>
                  <p className="text-muted-foreground">{selectedTestimonial.location}</p>
                </div>
              )}
              
              {selectedTestimonial?.property_type && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Property Type</h3>
                  <p className="text-muted-foreground capitalize">{selectedTestimonial.property_type}</p>
                </div>
              )}

              {selectedTestimonial?.rating && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Rating</h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${
                          i < selectedTestimonial.rating! ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="ml-2 text-muted-foreground">
                      ({selectedTestimonial.rating}/5)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Testimonials;