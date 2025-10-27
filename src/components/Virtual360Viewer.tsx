import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Palette,
  X,
  ZoomIn,
  ZoomOut
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
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [hue, setHue] = useState(0);
  const [warmth, setWarmth] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setImageError(false);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = images[currentImageIndex];
    img.onload = () => {
      imageRef.current = img;
      drawImage();
    };
    img.onerror = () => {
      console.error('Failed to load image:', images[currentImageIndex]);
      setImageError(true);
    };
  }, [currentImageIndex, images]);

  useEffect(() => {
    drawImage();
  }, [brightness, contrast, saturation, hue, warmth, zoom, position]);

  const drawImage = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply CSS filters
    const filters = [
      `brightness(${brightness}%)`,
      `contrast(${contrast}%)`,
      `saturate(${saturation}%)`,
      `hue-rotate(${hue}deg)`,
    ];
    ctx.filter = filters.join(' ');

    // Calculate scaling to cover the canvas
    const imgAspect = img.width / img.height;
    const canvasAspect = canvas.width / canvas.height;
    
    let drawWidth = canvas.width * zoom;
    let drawHeight = canvas.height * zoom;
    
    if (imgAspect > canvasAspect) {
      drawHeight = canvas.height * zoom;
      drawWidth = drawHeight * imgAspect;
    } else {
      drawWidth = canvas.width * zoom;
      drawHeight = drawWidth / imgAspect;
    }

    const x = (canvas.width - drawWidth) / 2 + position.x;
    const y = (canvas.height - drawHeight) / 2 + position.y;

    ctx.drawImage(img, x, y, drawWidth, drawHeight);

    // Apply warmth overlay
    if (warmth !== 0) {
      ctx.globalCompositeOperation = 'multiply';
      const warmthValue = warmth / 100;
      if (warmth > 0) {
        ctx.fillStyle = `rgba(255, 200, 150, ${warmthValue * 0.3})`;
      } else {
        ctx.fillStyle = `rgba(150, 200, 255, ${Math.abs(warmthValue) * 0.3})`;
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
    }

    ctx.restore();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const resetView = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setHue(0);
    setWarmth(0);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
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

      {/* Adjustments Panel */}
      {showColorPicker && (
        <div className="absolute top-20 right-4 z-10 bg-background rounded-lg shadow-xl p-4 w-80 border max-h-[70vh] overflow-y-auto">
          <h3 className="font-bold mb-4">Adjust Image</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Brightness: {brightness}%
              </label>
              <Slider
                value={[brightness]}
                onValueChange={(value) => setBrightness(value[0])}
                min={50}
                max={150}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Contrast: {contrast}%
              </label>
              <Slider
                value={[contrast]}
                onValueChange={(value) => setContrast(value[0])}
                min={50}
                max={150}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Saturation: {saturation}%
              </label>
              <Slider
                value={[saturation]}
                onValueChange={(value) => setSaturation(value[0])}
                min={0}
                max={200}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Warmth: {warmth > 0 ? '+' : ''}{warmth}
              </label>
              <Slider
                value={[warmth]}
                onValueChange={(value) => setWarmth(value[0])}
                min={-100}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Negative = cooler, Positive = warmer
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Hue Shift: {hue}°
              </label>
              <Slider
                value={[hue]}
                onValueChange={(value) => setHue(value[0])}
                min={-180}
                max={180}
                step={5}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Zoom: {Math.round(zoom * 100)}%
              </label>
              <Slider
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                min={0.5}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Image Canvas */}
      {!imageError ? (
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="bg-background p-8 rounded-lg shadow-xl max-w-md text-center">
            <h3 className="text-xl font-bold mb-2">Image Loading Error</h3>
            <p className="text-muted-foreground mb-4">
              Unable to load this image.
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
              {images.slice(0, Math.min(5, images.length)).map((_, idx) => (
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
              {images.length > 5 && (
                <span className="text-white/50 text-sm">+{images.length - 5}</span>
              )}
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
            Drag to pan • Scroll to zoom • Click palette to adjust colors & lighting
          </p>
        </div>
      </div>
    </div>
  );
};

export default Virtual360Viewer;
