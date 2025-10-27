import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Palette,
  X
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Virtual360ViewerProps {
  images: string[];
  propertyTitle: string;
  onClose: () => void;
}

const Virtual360Viewer: React.FC<Virtual360ViewerProps> = ({ 
  images, 
  propertyTitle,
  onClose 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouseX, setLastMouseX] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorFilter, setColorFilter] = useState('none');

  const getFilterStyle = () => {
    const filters = [];
    
    if (colorFilter === '#FFE6E6') filters.push('sepia(0.3) saturate(1.2) hue-rotate(-10deg)');
    else if (colorFilter === '#E6F2FF') filters.push('sepia(0.2) saturate(1.1) hue-rotate(180deg)');
    else if (colorFilter === '#FFF9E6') filters.push('brightness(1.1) saturate(0.9)');
    else if (colorFilter === '#F0F0F0') filters.push('grayscale(0.1) brightness(1.05)');
    
    return filters.join(' ');
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouseX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMouseX;
    setRotation(prev => prev + deltaX * 0.3);
    setLastMouseX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setLastMouseX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - lastMouseX;
    setRotation(prev => prev + deltaX * 0.3);
    setLastMouseX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setRotation(0);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setRotation(0);
  };

  const resetView = () => {
    setRotation(0);
    setZoom(1);
    setColorFilter('none');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white text-xl font-bold">{propertyTitle}</h2>
            <p className="text-white/70 text-sm">
              Image {currentImageIndex + 1} of {images.length}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="text-white hover:bg-white/20"
            >
              <Palette className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetView}
              className="text-white hover:bg-white/20"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Color Picker Panel */}
      {showColorPicker && (
        <div className="absolute top-20 right-4 z-10 bg-background rounded-lg shadow-xl p-4 w-80 border">
          <h3 className="font-bold mb-4">Customize Appearance</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Color Filter</label>
              <Select value={colorFilter} onValueChange={setColorFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="#FFE6E6">Warm Tone</SelectItem>
                  <SelectItem value="#E6F2FF">Cool Tone</SelectItem>
                  <SelectItem value="#FFF9E6">Soft Light</SelectItem>
                  <SelectItem value="#F0F0F0">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Main Image Viewer */}
      <div 
        className="w-full h-full overflow-hidden cursor-move select-none flex items-center justify-center"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[currentImageIndex]}
          alt={`${propertyTitle} - Image ${currentImageIndex + 1}`}
          className="max-w-none h-full object-contain"
          style={{
            transform: `rotate(${rotation}deg) scale(${zoom})`,
            filter: getFilterStyle(),
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
          draggable={false}
        />
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Zoom Control */}
          <div className="flex items-center gap-4 text-white">
            <span className="text-sm">Zoom</span>
            <Slider
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
              min={0.5}
              max={3}
              step={0.1}
              className="flex-1"
            />
            <span className="text-sm w-12">{Math.round(zoom * 100)}%</span>
          </div>

          {/* Image Navigation */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevImage}
              disabled={images.length <= 1}
              className="text-white hover:bg-white/20 h-12 w-12"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <div className="flex gap-2">
              {images.slice(0, 5).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentImageIndex 
                      ? 'bg-white w-8' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextImage}
              disabled={images.length <= 1}
              className="text-white hover:bg-white/20 h-12 w-12"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Instructions */}
          <p className="text-center text-white/70 text-sm">
            Drag to rotate • Use zoom slider • Click palette to apply filters
          </p>
        </div>
      </div>
    </div>
  );
};

export default Virtual360Viewer;
