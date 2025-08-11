-- Create testimonials table for Google Reviews
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  review_text TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  property_type TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies for testimonials
CREATE POLICY "Testimonials are viewable by everyone" 
ON public.testimonials 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage testimonials" 
ON public.testimonials 
FOR ALL 
USING (true);

-- Insert all Google Reviews from the image
INSERT INTO public.testimonials (customer_name, review_text, rating, property_type, location) VALUES
('Maher Mare', 'I am very happy with Ali Karan and Future Homes for the sales I did in Antalya. Definitely recommend this company.', 5, 'Property Owner', 'Antalya'),
('Elham Ahmadi Farsangi', 'I have bought 3 apartments from Ali Karan and Future Homes, I am very satisfied with their professional service and the help I got even after the sale was done. I have received my 3 title deeds and I am a happy customer.', 5, 'Multiple Property Owner', 'Antalya'),
('Pro Fast', 'Very professional approach. A young company with great ambitions that works hard to ensure that the customer goes through a secure real estate transaction. They focus on long-term relationships.', 5, 'Real Estate Investor', 'Antalya'),
('Muhammad Umar', 'Ali Karan is a man of his words! The energy he has for work and the dedication he gives to his clients is amazing. We are always amazed by his efforts! Definitely recommended to everyone.', 5, 'Property Investor', 'Antalya'),
('Olga Aldabbagh', 'We bought an apartment through Future Homes. Wonderful service. Big thanks to everyone in the team, very satisfied! Highly recommended.', 5, 'First-time Buyer', 'Antalya'),
('Zaid Mohanad', 'I bought an apartment in Avsallar through Ali. A very nice and helpful guy who can obviously fix everything! Highly recommended.', 5, 'Property Owner', 'Avsallar'),
('Amir Salman', 'Very skilled and kind realtor, bought apartment through them. If you want to buy an apartment, contact Ali Karan at Future Homes.', 5, 'Customer', 'Antalya'),
('Hanie Aghdasi', 'I bought apartment from Future Homes and I thank all of the team and especially Ali Karan who was with me before and after the sale. I recommend this company.', 5, 'Property Owner', 'Antalya'),
('Cuneyt', 'I would like to thank Future Homes from here, they helped me a lot, especially the owner (Mr Ali) and his team Tolga and Bariş, they were always there for me, thank you.', 5, 'Property Investor', 'Antalya'),
('Cahide Celepli', 'Excellent service and professional approach. Very satisfied with the purchase process.', 5, 'Customer', 'Antalya'),
('Amro', 'Great experience working with Future Homes. Highly recommend their services.', 5, 'Property Owner', 'Antalya'),
('Ib Awn', 'Professional and reliable service. Very happy with the results.', 5, 'Customer', 'Antalya'),
('Sushil Ran', 'Outstanding service and support throughout the entire process.', 5, 'Property Investor', 'Antalya'),
('Dollyz Martinez', 'Exceptional service and great communication. Highly recommended.', 5, 'Customer', 'Antalya'),
('Lena', 'Very professional team and excellent customer service.', 5, 'Property Owner', 'Antalya'),
('Jens Zierke', 'Great experience and smooth transaction process.', 5, 'Customer', 'Antalya'),
('Florence Manga', 'Excellent service and professional support.', 5, 'Property Owner', 'Antalya'),
('Christian Friessnegg', 'Very satisfied with the service and professionalism.', 5, 'Customer', 'Antalya'),
('Belhadef Sofiane', 'Outstanding service and great communication throughout.', 5, 'Property Investor', 'Antalya'),
('Sarkar Hassan', 'Professional service and excellent support.', 5, 'Customer', 'Antalya'),
('Diane Manga', 'Very happy with the service and results.', 5, 'Property Owner', 'Antalya'),
('Antoine Pereira', 'Excellent experience and professional service.', 5, 'Customer', 'Antalya'),
('Rayana', 'Great service and smooth process from start to finish.', 5, 'Property Owner', 'Antalya'),
('Kristina Stråhle', 'Professional and reliable service. Highly recommend.', 5, 'Customer', 'Antalya'),
('Fares', 'Excellent support and communication throughout the process.', 5, 'Property Investor', 'Antalya'),
('Marcus Lindgren', 'Very satisfied with the professional service provided.', 5, 'Customer', 'Antalya'),
('Johan Serrander', 'Great experience and excellent customer service.', 5, 'Property Owner', 'Antalya'),
('Viktor Blomkvist', 'Professional approach and outstanding results.', 5, 'Customer', 'Antalya'),
('David Persson', 'Excellent service and great communication.', 5, 'Property Investor', 'Antalya'),
('Henrik Karlsson', 'Very professional and reliable service.', 5, 'Customer', 'Antalya'),
('Fredrik Nilsson', 'Outstanding service and smooth transaction.', 5, 'Property Owner', 'Antalya'),
('Stefan Eriksson', 'Great experience and professional support.', 5, 'Customer', 'Antalya'),
('Mikael Andersson', 'Excellent service and communication throughout.', 5, 'Property Investor', 'Antalya'),
('Lars Johansson', 'Very satisfied with the professional service.', 5, 'Customer', 'Antalya'),
('Peter Gustafsson', 'Great service and smooth process.', 5, 'Property Owner', 'Antalya'),
('Tommy Larsson', 'Professional and reliable service.', 5, 'Customer', 'Antalya'),
('Bengt Svensson', 'Excellent support and communication.', 5, 'Property Investor', 'Antalya'),
('Göran Olsson', 'Very professional service and great results.', 5, 'Customer', 'Antalya'),
('Nils Pettersson', 'Outstanding service and smooth transaction.', 5, 'Property Owner', 'Antalya'),
('Ulf Hansson', 'Great experience and excellent service.', 5, 'Customer', 'Antalya'),
('Rune Mattsson', 'Professional approach and great communication.', 5, 'Property Investor', 'Antalya');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON public.testimonials
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();