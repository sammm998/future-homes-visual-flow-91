import React from 'react';
import Navigation from '@/components/Navigation';
import GenerateBaliImages from '@/components/GenerateBaliImages';

const GenerateImages = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI Image Generation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate professional AI images for your articles using advanced image generation technology.
          </p>
        </div>
        
        <GenerateBaliImages />
      </div>
    </div>
  );
};

export default GenerateImages;