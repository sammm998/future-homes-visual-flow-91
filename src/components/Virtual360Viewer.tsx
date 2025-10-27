import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Home,
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouseX, setLastMouseX] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [wallColor, setWallColor] = useState('#FFFFFF');
  const [floorColor, setFloorColor] = useState('#D4A574');
  const [colorFilter, setColorFilter] = useState('none');
  const [imageError, setImageError] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setImageError(false);
    const img = new Image();
    img.src = images[currentImageIndex];
    img.onload = () => {
      imageRef.current = img;
      drawImage();
    };
    img.onerror = (e) => {
      console.error('Failed to load image:', images[currentImageIndex], e);
      setImageError(true);
    };
  }, [currentImageIndex, rotation, zoom, colorFilter, wallColor, floorColor]);

  const drawImage = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    
    const imgWidth = img.width;
    const imgHeight = img.height;
    const scale = Math.max(canvas.width / imgWidth, canvas.height / imgHeight);
    const scaledWidth = imgWidth * scale;
    const scaledHeight = imgHeight * scale;
    
    ctx.drawImage(
      img,
      -scaledWidth / 2,
      -scaledHeight / 2,
      scaledWidth,
      scaledHeight
    );

    // Apply color filters
    if (colorFilter !== 'none') {
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = colorFilter;
      ctx.fillRect(
        -scaledWidth / 2,
        -scaledHeight / 2,
        scaledWidth,
        scaledHeight
      );
      ctx.globalCompositeOperation = 'source-over';
    }

    ctx.restore();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouseX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMouseX;
    setRotation(prev => (prev + deltaX * 0.5) % 360);
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
    setRotation(prev => (prev + deltaX * 0.5) % 360);
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

  const wallColors = [
    { name: 'White', value: '#FFFFFF' },
    { name: 'Beige', value: '#F5F5DC' },
    { name: 'Light Gray', value: '#D3D3D3' },
    { name: 'Soft Blue', value: '#ADD8E6' },
    { name: 'Sage Green', value: '#9DC183' },
    { name: 'Warm Taupe', value: '#D0BCAC' },
  ];

  const floorColors = [
    { name: 'Light Wood', value: '#D4A574' },
    { name: 'Dark Wood', value: '#8B4513' },
    { name: 'White Tile', value: '#F8F8F8' },
    { name: 'Gray Tile', value: '#808080' },
    { name: 'Marble', value: '#E8E8E8' },
  ];

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
        <div className="absolute top-20 right-4 z-10 bg-white rounded-lg shadow-xl p-4 w-80">
          <h3 className="font-bold mb-4">Customize Colors</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Wall Color</label>
              <Select value={wallColor} onValueChange={setWallColor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {wallColors.map(color => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded border" 
                          style={{ backgroundColor: color.value }}
                        />
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Floor Color</label>
              <Select value={floorColor} onValueChange={setFloorColor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {floorColors.map(color => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded border" 
                          style={{ backgroundColor: color.value }}
                        />
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Color Filter</label>
              <Select value={colorFilter} onValueChange={setColorFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="#FFE6E6">Warm</SelectItem>
                  <SelectItem value="#E6F2FF">Cool</SelectItem>
                  <SelectItem value="#FFF9E6">Soft</SelectItem>
                  <SelectItem value="#F0F0F0">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Error Message */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="bg-background p-8 rounded-lg shadow-xl max-w-md text-center">
            <h3 className="text-xl font-bold mb-2">Image Loading Error</h3>
            <p className="text-muted-foreground mb-4">
              Unable to load this image due to access restrictions.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Image {currentImageIndex + 1} of {images.length}
            </p>
            <div className="flex gap-2 justify-center">
              {images.length > 1 && (
                <Button onClick={nextImage} variant="outline">
                  Try Next Image
                </Button>
              )}
              <Button onClick={onClose}>
                Close Viewer
              </Button>
            </div>
          </div>
        </div>
      )}

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
            Drag to rotate • Scroll to zoom • Click palette to customize colors
          </p>
        </div>
      </div>
    </div>
  );
};

export default Virtual360Viewer;
