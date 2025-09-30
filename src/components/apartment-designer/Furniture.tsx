import { useRef } from 'react';
import { Mesh } from 'three';

interface FurnitureProps {
  type: string;
  position: [number, number, number];
}

export const Furniture = ({ type, position }: FurnitureProps) => {
  const meshRef = useRef<Mesh>(null);

  const getFurniture = () => {
    switch (type) {
      case 'sofa':
        return (
          <group position={position}>
            {/* Sofa base */}
            <mesh position={[0, 0.3, 0]} castShadow>
              <boxGeometry args={[2, 0.6, 0.8]} />
              <meshStandardMaterial color="#4a5568" />
            </mesh>
            {/* Sofa back */}
            <mesh position={[0, 0.8, -0.3]} castShadow>
              <boxGeometry args={[2, 0.8, 0.2]} />
              <meshStandardMaterial color="#4a5568" />
            </mesh>
          </group>
        );
      case 'bed':
        return (
          <group position={position}>
            {/* Mattress */}
            <mesh position={[0, 0.4, 0]} castShadow>
              <boxGeometry args={[2, 0.4, 2.5]} />
              <meshStandardMaterial color="#e2e8f0" />
            </mesh>
            {/* Headboard */}
            <mesh position={[0, 0.8, -1.2]} castShadow>
              <boxGeometry args={[2, 1.2, 0.1]} />
              <meshStandardMaterial color="#4a5568" />
            </mesh>
          </group>
        );
      case 'table':
        return (
          <group position={position}>
            {/* Table top */}
            <mesh position={[0, 0.7, 0]} castShadow>
              <boxGeometry args={[1.5, 0.1, 1]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
            {/* Legs */}
            {[[0.6, 0.35, 0.4], [-0.6, 0.35, 0.4], [0.6, 0.35, -0.4], [-0.6, 0.35, -0.4]].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]} castShadow>
                <boxGeometry args={[0.1, 0.7, 0.1]} />
                <meshStandardMaterial color="#654321" />
              </mesh>
            ))}
          </group>
        );
      case 'chair':
        return (
          <group position={position}>
            {/* Seat */}
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[0.5, 0.1, 0.5]} />
              <meshStandardMaterial color="#4a5568" />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, 0.8, -0.2]} castShadow>
              <boxGeometry args={[0.5, 0.6, 0.1]} />
              <meshStandardMaterial color="#4a5568" />
            </mesh>
          </group>
        );
      default:
        return null;
    }
  };

  return <>{getFurniture()}</>;
};
