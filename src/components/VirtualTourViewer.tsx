import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/OptimizedImage';

interface VirtualTourViewerProps {
  property: any;
}

export const VirtualTourViewer: React.FC<VirtualTourViewerProps> = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const images = property.property_images || [];
  const currentImage = images[currentImageIndex];

  useEffect(() => {
    // Auto-rotate functionality
    const interval = setInterval(() => {
      if (!isDragging) {
        setRotation((prev) => (prev + 0.2) % 360);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setRotation((prev) => (prev + deltaX * 0.5) % 360);
      setPosition((prev) => ({
        x: prev.x + deltaX * 0.5,
        y: prev.y + deltaY * 0.5,
      }));
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStart.x;
      const deltaY = touch.clientY - dragStart.y;
      
      setRotation((prev) => (prev + deltaX * 0.5) % 360);
      setPosition((prev) => ({
        x: prev.x + deltaX * 0.5,
        y: prev.y + deltaY * 0.5,
      }));
      
      setDragStart({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setRotation(0);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setRotation(0);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };

  const resetView = () => {
    setRotation(0);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-card rounded-lg p-6 space-y-6">
        {/* Property Info */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-foreground">{property.title}</h2>
          <p className="text-lg text-muted-foreground">{property.location}</p>
          <p className="text-2xl font-bold text-primary">{property.price}</p>
        </div>

        {/* Viewer Container */}
        <div
          ref={containerRef}
          className="relative w-full aspect-video bg-black rounded-lg overflow-hidden cursor-move select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-100"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${zoom})`,
            }}
          >
            <img
              src={currentImage}
              alt={`${property.title} - Bild ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain pointer-events-none"
              draggable={false}
            />
          </div>

          {/* Navigation Overlays */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-10"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-10"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>

          {/* Instructions */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm text-center">
            Dra för att rotera • Scrolla för zoom
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="flex items-center gap-2"
          >
            <ZoomOut className="h-4 w-4" />
            Zooma ut
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            className="flex items-center gap-2"
          >
            <ZoomIn className="h-4 w-4" />
            Zooma in
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetView}
            className="flex items-center gap-2"
          >
            <RotateCw className="h-4 w-4" />
            Återställ
          </Button>
        </div>

        {/* Thumbnail Gallery */}
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {images.map((image: string, index: number) => (
            <button
              key={index}
              onClick={() => {
                setCurrentImageIndex(index);
                resetView();
              }}
              className={`aspect-video rounded-lg overflow-hidden transition-all ${
                index === currentImageIndex
                  ? 'ring-2 ring-primary scale-105'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Property Details */}
        {property.description && (
          <div className="pt-4 border-t border-border">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Om fastigheten
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {property.description}
            </p>
          </div>
        )}

        {property.features && property.features.length > 0 && (
          <div className="pt-4 border-t border-border">
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Faciliteter
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {property.features.map((feature: string, index: number) => (
                <div
                  key={index}
                  className="bg-muted px-3 py-2 rounded-lg text-sm text-foreground"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
