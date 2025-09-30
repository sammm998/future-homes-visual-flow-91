import { useRef } from 'react';
import { Mesh } from 'three';

interface DetailedFurnitureProps {
  type: string;
  position: [number, number, number];
  scale?: number;
}

export const DetailedFurniture = ({ type, position, scale = 1 }: DetailedFurnitureProps) => {
  const meshRef = useRef<Mesh>(null);

  const renderFurniture = () => {
    switch (type) {
      case 'sofa':
        return (
          <group position={position} scale={scale}>
            {/* Sofa base */}
            <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.5, 0.7, 1]} />
              <meshStandardMaterial color="#4a5568" roughness={0.8} />
            </mesh>
            {/* Sofa back */}
            <mesh position={[0, 0.9, -0.4]} castShadow receiveShadow>
              <boxGeometry args={[2.5, 1, 0.2]} />
              <meshStandardMaterial color="#4a5568" roughness={0.8} />
            </mesh>
            {/* Armrests */}
            <mesh position={[-1.15, 0.6, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.2, 0.8, 1]} />
              <meshStandardMaterial color="#3a4558" roughness={0.8} />
            </mesh>
            <mesh position={[1.15, 0.6, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.2, 0.8, 1]} />
              <meshStandardMaterial color="#3a4558" roughness={0.8} />
            </mesh>
            {/* Cushions */}
            {[-0.6, 0, 0.6].map((x, i) => (
              <mesh key={i} position={[x, 0.75, 0.1]} castShadow>
                <boxGeometry args={[0.5, 0.15, 0.5]} />
                <meshStandardMaterial color="#6b7280" roughness={0.6} />
              </mesh>
            ))}
          </group>
        );

      case 'bed':
        return (
          <group position={position} scale={scale}>
            {/* Mattress */}
            <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[2, 0.5, 2.2]} />
              <meshStandardMaterial color="#f0f0f0" roughness={0.7} />
            </mesh>
            {/* Blanket */}
            <mesh position={[0, 0.8, 0.3]} castShadow>
              <boxGeometry args={[1.8, 0.15, 1.5]} />
              <meshStandardMaterial color="#8b9dc3" roughness={0.5} />
            </mesh>
            {/* Headboard */}
            <mesh position={[0, 1, -1]} castShadow receiveShadow>
              <boxGeometry args={[2.2, 1.4, 0.15]} />
              <meshStandardMaterial color="#3a3a3a" roughness={0.6} />
            </mesh>
            {/* Pillows */}
            {[-0.4, 0.4].map((x, i) => (
              <mesh key={i} position={[x, 0.85, -0.6]} castShadow>
                <boxGeometry args={[0.6, 0.2, 0.4]} />
                <meshStandardMaterial color="#ffffff" roughness={0.8} />
              </mesh>
            ))}
          </group>
        );

      case 'table':
        return (
          <group position={position} scale={scale}>
            {/* Table top */}
            <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.8, 0.08, 1.2]} />
              <meshStandardMaterial color="#8b6f47" roughness={0.5} metalness={0.1} />
            </mesh>
            {/* Legs */}
            {[
              [0.8, 0.375, 0.5],
              [-0.8, 0.375, 0.5],
              [0.8, 0.375, -0.5],
              [-0.8, 0.375, -0.5]
            ].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
                <boxGeometry args={[0.08, 0.75, 0.08]} />
                <meshStandardMaterial color="#654321" roughness={0.7} />
              </mesh>
            ))}
            {/* Decorative items on table */}
            <mesh position={[0, 0.85, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
              <meshStandardMaterial color="#c4a77d" roughness={0.4} />
            </mesh>
          </group>
        );

      case 'chair':
        return (
          <group position={position} scale={scale}>
            {/* Seat */}
            <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.5, 0.08, 0.5]} />
              <meshStandardMaterial color="#4a5568" roughness={0.8} />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, 0.85, -0.2]} castShadow receiveShadow>
              <boxGeometry args={[0.5, 0.7, 0.08]} />
              <meshStandardMaterial color="#4a5568" roughness={0.8} />
            </mesh>
            {/* Legs */}
            {[
              [0.2, 0.25, 0.2],
              [-0.2, 0.25, 0.2],
              [0.2, 0.25, -0.2],
              [-0.2, 0.25, -0.2]
            ].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]} castShadow>
                <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
                <meshStandardMaterial color="#2d3748" roughness={0.7} />
              </mesh>
            ))}
          </group>
        );

      default:
        return null;
    }
  };

  return <>{renderFurniture()}</>;
};
