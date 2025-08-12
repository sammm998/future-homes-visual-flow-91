import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const MersinPropertySearch = () => {
  // Hardcoded Mersin properties for testing
  const properties = [
    {
      id: 6002,
      title: "Modern villa complex near Mersin Marina",
      location: "Mersin, Marina District",
      price: "€250,000",
      bedrooms: "3+1",
      bathrooms: "2",
      area: "140",
      status: "Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/6002/general/mersin-villa-marina.webp"
    },
    {
      id: 6003,
      title: "Seaside apartment in Mersin",
      location: "Mersin, Erdemli",
      price: "€180,000",
      bedrooms: "2+1",
      bathrooms: "1",
      area: "95",
      status: "Ready to Move",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/default/general/default.webp"
    },
    {
      id: 6004,
      title: "Luxury penthouse in Mersin center",
      location: "Mersin, City Center",
      price: "€320,000",
      bedrooms: "4+1",
      bathrooms: "3",
      area: "180",
      status: "Under Construction",
      image: "https://cdn.futurehomesturkey.com/uploads/thumbs/pages/default/general/default.webp"
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: 'system-ui, sans-serif' }}>
      {/* Simple Navigation */}
      <nav style={{ backgroundColor: '#1f2937', padding: '1rem', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Future Homes Turkey</h1>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
          Properties in Mersin
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          {properties.length} properties found
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {properties.map((property) => (
            <div key={property.id} style={{ 
              border: '1px solid #e5e7eb', 
              borderRadius: '0.5rem', 
              padding: '1rem', 
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }}>
              <img 
                src={property.image} 
                alt={property.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.375rem', marginBottom: '1rem' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/lovable-uploads/000f440d-ddb1-4c1b-9202-eef1ef588a8c.png';
                }}
              />
              <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem', color: '#111827' }}>
                {property.title}
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                📍 {property.location}
              </p>
              <p style={{ color: '#059669', fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                {property.price}
              </p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                <span>🛏️ {property.bedrooms}</span>
                <span>🛁 {property.bathrooms}</span>
                <span>📐 {property.area}m²</span>
              </div>
              <div>
                <span style={{ 
                  display: 'inline-block', 
                  backgroundColor: property.status === 'Ready to Move' ? '#dcfce7' : '#dbeafe', 
                  color: property.status === 'Ready to Move' ? '#065f46' : '#1e40af',
                  fontSize: '0.75rem', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '0.25rem',
                  fontWeight: '500'
                }}>
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

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/mersin" element={<MersinPropertySearch />} />
      <Route path="*" element={<div style={{padding: '2rem', textAlign: 'center'}}>Page not found</div>} />
    </Routes>
  </BrowserRouter>
);

export default App;