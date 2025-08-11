import React from 'react';

interface RealEstateListingSchemaProps {
  property: {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    location: {
      city: string;
      country: string;
      address?: string;
    };
    propertyType: string;
    bedrooms?: number;
    bathrooms?: number;
    floorSize?: number;
    images?: string[];
    url: string;
  };
}

const RealEstateListingSchema: React.FC<RealEstateListingSchemaProps> = ({ property }) => {
  const listingSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": property.url,
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": property.currency,
      "availability": "https://schema.org/InStock"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.location.city,
      "addressCountry": property.location.country,
      ...(property.location.address && { "streetAddress": property.location.address })
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "36.8969", // Default to Antalya coordinates
      "longitude": "30.7133"
    },
    "propertyType": property.propertyType,
    ...(property.bedrooms && { "numberOfRooms": property.bedrooms }),
    ...(property.bathrooms && { "numberOfBathroomsTotal": property.bathrooms }),
    ...(property.floorSize && { "floorSize": `${property.floorSize} sqm` }),
    ...(property.images && property.images.length > 0 && {
      "image": property.images
    }),
    "realEstateAgent": {
      "@type": "RealEstateAgent",
      "name": "Future Homes",
      "url": "https://futurehomesturkey.com"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }}
    />
  );
};

export default RealEstateListingSchema;