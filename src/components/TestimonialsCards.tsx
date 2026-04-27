import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Star } from 'lucide-react';

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

interface Testimonial {
  id: string;
  customer_name: string;
  customer_country?: string;
  review_text: string;
  rating?: number;
  property_type?: string;
  location?: string;
  image_url?: string;
  designation?: string;
  company_name?: string;
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

const TestimonialsCards = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) {
          console.error('Error fetching testimonials:', error);
          return;
        }

        if (data) {
          setTestimonials(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto mb-12"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover why thousands of clients trust us with their property investments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              
              <p className="text-card-foreground mb-6 line-clamp-4">
                "{testimonial.review_text}"
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                  {localImageMap[testimonial.customer_name] || testimonial.image_url ? (
                    <img 
                      src={localImageMap[testimonial.customer_name] || testimonial.image_url} 
                      alt={testimonial.customer_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-primary font-semibold text-lg">
                      {testimonial.customer_name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-card-foreground">
                    {testimonial.customer_name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.customer_country && `${testimonial.customer_country} • `}
                    {testimonial.designation || 'Customer'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCards;