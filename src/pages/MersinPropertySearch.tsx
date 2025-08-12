import React, { useState, useMemo } from 'react';
import { allMersinProperties } from "@/data/allPropertiesData";

const MersinPropertySearch = () => {
  const properties = allMersinProperties;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Properties in Mersin
        </h1>
        <p className="text-gray-600 mb-6">
          {properties.length} properties found
        </p>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div key={property.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <img 
                src={property.image} 
                alt={property.title}
                className="w-full h-48 object-cover rounded mb-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/lovable-uploads/000f440d-ddb1-4c1b-9202-eef1ef588a8c.png';
                }}
              />
              <h3 className="font-bold text-lg mb-2">{property.title}</h3>
              <p className="text-gray-600 mb-2">{property.location}</p>
              <p className="text-green-600 font-bold text-xl mb-2">{property.price}</p>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>{property.bedrooms}</span>
                <span>{property.bathrooms} bath</span>
                <span>{property.area}m²</span>
              </div>
              <div className="mt-2">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {property.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MersinPropertySearch;