import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { X, RotateCcw, Sun, Contrast, Droplets, Thermometer, Palette } from 'lucide-react';

interface ImageEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
}

interface Adjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  warmth: number;
  hue: number;
}

export const ImageEditorDialog: React.FC<ImageEditorDialogProps> = ({
  isOpen,
  onClose,
  imageSrc,
  imageAlt,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  
  const [adjustments, setAdjustments] = useState<Adjustments>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    warmth: 0,
    hue: 0,
  });

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Load image
  useEffect(() => {
    if (!isOpen) return;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      setIsImageLoaded(true);
      applyFilters();
    };
    img.src = imageSrc;
  }, [imageSrc, isOpen]);

  // Apply filters whenever adjustments change
  useEffect(() => {
    if (isImageLoaded) {
      applyFilters();
    }
  }, [adjustments, isImageLoaded]);

  const applyFilters = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw original image
    ctx.drawImage(img, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Apply adjustments to each pixel
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Brightness
      const brightnessFactor = adjustments.brightness / 100;
      r *= brightnessFactor;
      g *= brightnessFactor;
      b *= brightnessFactor;

      // Contrast
      const contrastFactor = adjustments.contrast / 100;
      r = ((r / 255 - 0.5) * contrastFactor + 0.5) * 255;
      g = ((g / 255 - 0.5) * contrastFactor + 0.5) * 255;
      b = ((b / 255 - 0.5) * contrastFactor + 0.5) * 255;

      // Convert to HSL for saturation and hue adjustments
      const [h, s, l] = rgbToHsl(r, g, b);

      // Saturation
      const newS = Math.max(0, Math.min(1, s * (adjustments.saturation / 100)));

      // Hue shift
      const newH = (h + adjustments.hue / 360) % 1;

      // Convert back to RGB
      [r, g, b] = hslToRgb(newH, newS, l);

      // Warmth (add orange tint for positive, blue for negative)
      if (adjustments.warmth !== 0) {
        const warmthFactor = adjustments.warmth / 100;
        r += warmthFactor * 50;
        b -= warmthFactor * 30;
      }

      // Clamp values
      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const resetAdjustments = () => {
    setAdjustments({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      warmth: 0,
      hue: 0,
    });
  };

  const updateAdjustment = (key: keyof Adjustments, value: number[]) => {
    setAdjustments(prev => ({ ...prev, [key]: value[0] }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="absolute top-4 left-4 z-10 bg-black/80 text-white p-3 rounded-lg">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Bildredigerare
          </DialogTitle>
        </DialogHeader>

        <Button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/80 text-white hover:bg-black/90"
          size="icon"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Canvas Display */}
          <div className="flex-1 bg-black flex items-center justify-center p-4 md:p-8">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Controls Panel */}
          <div className="w-full md:w-80 bg-background/95 backdrop-blur-sm p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Justeringar</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={resetAdjustments}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Återställ
              </Button>
            </div>

            {/* Brightness */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                Ljusstyrka
                <span className="ml-auto text-muted-foreground">{adjustments.brightness}%</span>
              </Label>
              <Slider
                value={[adjustments.brightness]}
                onValueChange={(value) => updateAdjustment('brightness', value)}
                min={0}
                max={200}
                step={1}
                className="w-full"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Contrast className="w-4 h-4" />
                Kontrast
                <span className="ml-auto text-muted-foreground">{adjustments.contrast}%</span>
              </Label>
              <Slider
                value={[adjustments.contrast]}
                onValueChange={(value) => updateAdjustment('contrast', value)}
                min={0}
                max={200}
                step={1}
                className="w-full"
              />
            </div>

            {/* Saturation */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                Mättnad
                <span className="ml-auto text-muted-foreground">{adjustments.saturation}%</span>
              </Label>
              <Slider
                value={[adjustments.saturation]}
                onValueChange={(value) => updateAdjustment('saturation', value)}
                min={0}
                max={200}
                step={1}
                className="w-full"
              />
            </div>

            {/* Warmth */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                Färgtemperatur
                <span className="ml-auto text-muted-foreground">{adjustments.warmth > 0 ? '+' : ''}{adjustments.warmth}</span>
              </Label>
              <Slider
                value={[adjustments.warmth]}
                onValueChange={(value) => updateAdjustment('warmth', value)}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Hue */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Färgskiftning
                <span className="ml-auto text-muted-foreground">{adjustments.hue}°</span>
              </Label>
              <Slider
                value={[adjustments.hue]}
                onValueChange={(value) => updateAdjustment('hue', value)}
                min={-180}
                max={180}
                step={1}
                className="w-full"
              />
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Justera bilderna för att få perfekt utseende. Ändringarna är tillfälliga och påverkar inte originalbilden.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper functions for RGB to HSL conversion
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r * 255, g * 255, b * 255];
}
