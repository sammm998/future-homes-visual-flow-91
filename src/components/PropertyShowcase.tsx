
import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '@/contexts/CurrencyContext';



const PropertyShowcase = () => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  

  const properties = [
    {
      id: 3184,
      title: "Twin villas with launch price in new project",
      location: "Antalya, Kemer",
      price: formatPrice(350000),
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3184/general/property-antalya-kemer-general-3184-0.webp",
      area: "115 m²",
      bedrooms: 3,
      bathrooms: 2
    },
    {
      id: 4636,
      title: "Luxury apartments with walking distance to the beach",
      location: "Dubai, Marina",
      price: formatPrice(1110000),
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4636/general/apartment-321429.webp",
      area: "78-1,505 m²",
      bedrooms: "1-6",
      bathrooms: "2-7"
    },
    {
      id: 3128,
      title: "Spacious apartments suitable for investment",
      location: "Antalya, Aksu",
      price: formatPrice(135000),
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3128/general/property-antalya-aksu-general-3128-0.webp",
      area: "75-104 m²",
      bedrooms: "1-2",
      bathrooms: "1-2"
    },
    {
      id: 3202,
      title: "Stylish apartments with modern design",
      location: "Antalya, Aksu",
      price: formatPrice(147000),
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/3202/general/property-antalya-aksu-general-3202-0.webp",
      area: "60-100 m²",
      bedrooms: "1-2",
      bathrooms: "1-2"
    },
    {
      id: 4563,
      title: "Luxury apartments in magnificent complex",
      location: "Dubai, Jumeirah Village Circle",
      price: formatPrice(313000),
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4563/general/apartment-320190.webp",
      area: "70-112 m²",
      bedrooms: "1-2",
      bathrooms: "1-2"
    },
    {
      id: 4630,
      title: "Ready to move-in luxury apartment close to daily amenities",
      location: "Antalya, Altintas",
      price: formatPrice(110000),
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/4630/general/apartment-321354.webp",
      area: "72 m²",
      bedrooms: 1,
      bathrooms: 1
    }
  ];

  const handlePropertyClick = (property: any) => {
    navigate(`/property/${property.id}`);
  };

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Premium Properties Worldwide
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Explore our carefully curated selection of premium properties
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => handlePropertyClick(property)}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  {property.price}
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {property.title}
                </h3>
                <p className="text-muted-foreground mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {property.location}
                </p>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{property.area}</span>
                  <span>{property.bedrooms} bed • {property.bathrooms} bath</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(PropertyShowcase);
