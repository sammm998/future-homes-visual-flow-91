import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { TextureLoader, BackSide, DoubleSide } from 'three';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Palette,
  X,
  Home
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

// Panorama Sphere Component
function PanoramaSphere({ imageUrl, wallColor, floorColor, colorFilter }: { 
  imageUrl: string; 
  wallColor: string;
  floorColor: string;
  colorFilter: string;
}) {
  const meshRef = useRef<any>();
  const texture = useLoader(TextureLoader, imageUrl);

  useFrame(() => {
    if (meshRef.current) {
      // Gentle automatic rotation when not dragging
      meshRef.current.rotation.y += 0.0005;
    }
  });

  const getFilterValues = () => {
    switch (colorFilter) {
      case 'warm': return { r: 1.2, g: 1.0, b: 0.9 };
      case 'cool': return { r: 0.9, g: 1.0, b: 1.2 };
      case 'soft': return { r: 1.1, g: 1.1, b: 0.95 };
      case 'neutral': return { r: 0.95, g: 0.95, b: 0.95 };
      default: return { r: 1, g: 1, b: 1 };
    }
  };

  const filter = getFilterValues();

  return (
    <mesh ref={meshRef} rotation={[0, Math.PI, 0]}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial 
        map={texture} 
        side={BackSide}
        color={[filter.r, filter.g, filter.b]}
        toneMapped={false}
      />
    </mesh>
  );
}

// Wall and Floor Overlays (simplified colored planes for demo)
function ColorOverlays({ wallColor, floorColor, opacity }: { 
  wallColor: string;
  floorColor: string;
  opacity: number;
}) {
  if (opacity === 0) return null;

  return (
    <>
      {/* Floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -200, 0]}>
        <circleGeometry args={[400, 32]} />
        <meshBasicMaterial 
          color={floorColor} 
          transparent 
          opacity={opacity * 0.3}
          side={DoubleSide}
        />
      </mesh>
      
      {/* Wall tint sphere */}
      <mesh>
        <sphereGeometry args={[490, 60, 40]} />
        <meshBasicMaterial 
          color={wallColor} 
          transparent 
          opacity={opacity * 0.15}
          side={BackSide}
        />
      </mesh>
    </>
  );
}

const Virtual360Viewer: React.FC<Virtual360ViewerProps> = ({ 
  images, 
  propertyTitle,
  onClose 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [wallColor, setWallColor] = useState('#FFFFFF');
  const [floorColor, setFloorColor] = useState('#D4A574');
  const [colorFilter, setColorFilter] = useState('none');
  const [colorOpacity, setColorOpacity] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
    // Preload image to check if it loads
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = images[currentImageIndex];
    img.onerror = () => {
      console.error('Failed to load 360 image:', images[currentImageIndex]);
      setImageError(true);
    };
  }, [currentImageIndex, images]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const resetView = () => {
    setColorFilter('none');
    setWallColor('#FFFFFF');
    setFloorColor('#D4A574');
    setColorOpacity(0);
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
    { name: 'Black Tile', value: '#2C2C2C' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white text-xl font-bold">{propertyTitle}</h2>
            <p className="text-white/70 text-sm">
              360° View - Image {currentImageIndex + 1} of {images.length}
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
        <div className="absolute top-20 right-4 z-10 bg-background rounded-lg shadow-xl p-4 w-80 border max-h-[70vh] overflow-y-auto">
          <h3 className="font-bold mb-4">Customize Appearance</h3>
          
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
              <label className="text-sm font-medium mb-2 block">
                Color Intensity ({Math.round(colorOpacity * 100)}%)
              </label>
              <Slider
                value={[colorOpacity]}
                onValueChange={(value) => setColorOpacity(value[0])}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Light Filter</label>
              <Select value={colorFilter} onValueChange={setColorFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="warm">Warm Light</SelectItem>
                  <SelectItem value="cool">Cool Light</SelectItem>
                  <SelectItem value="soft">Soft Light</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* 360 Canvas */}
      {!imageError ? (
        <Canvas
          camera={{ position: [0, 0, 0.1], fov: 75 }}
          style={{ width: '100%', height: '100%' }}
        >
          <PanoramaSphere 
            imageUrl={images[currentImageIndex]}
            wallColor={wallColor}
            floorColor={floorColor}
            colorFilter={colorFilter}
          />
          <ColorOverlays 
            wallColor={wallColor}
            floorColor={floorColor}
            opacity={colorOpacity}
          />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            rotateSpeed={-0.5}
            zoomSpeed={0.5}
            minDistance={0.1}
            maxDistance={10}
            target={[0, 0, 0]}
          />
        </Canvas>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="bg-background p-8 rounded-lg shadow-xl max-w-md text-center">
            <h3 className="text-xl font-bold mb-2">Image Loading Error</h3>
            <p className="text-muted-foreground mb-4">
              Unable to load this 360° image.
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
            Drag to look around • Scroll to zoom • Click palette to customize colors
          </p>
        </div>
      </div>
    </div>
  );
};

export default Virtual360Viewer;
