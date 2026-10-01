import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { useMemo } from "react";

type ViewMode = "blueprint" | "finished";

interface InteractivePropertyModelProps {
  mode: ViewMode;
}

const rooms = [
  { position: [-2.5, 0.08, 0] as [number, number, number], size: [3.8, 0.16, 5.8] as [number, number, number] },
  { position: [1.5, 0.08, -1.55] as [number, number, number], size: [3.8, 0.16, 2.7] as [number, number, number] },
  { position: [1.5, 0.08, 1.65] as [number, number, number], size: [3.8, 0.16, 3.3] as [number, number, number] },
];

const walls = [
  { position: [0, 1.25, -3] as [number, number, number], size: [8, 2.5, 0.12] as [number, number, number] },
  { position: [-4, 1.25, 0] as [number, number, number], size: [0.12, 2.5, 6] as [number, number, number] },
  { position: [4, 1.25, 0] as [number, number, number], size: [0.12, 2.5, 6] as [number, number, number] },
  { position: [0, 1.25, 3] as [number, number, number], size: [8, 2.5, 0.12] as [number, number, number] },
  { position: [-0.5, 1.25, 1.15] as [number, number, number], size: [0.12, 2.5, 3.7] as [number, number, number] },
  { position: [1.75, 1.25, 0.25] as [number, number, number], size: [4.5, 2.5, 0.12] as [number, number, number] },
];

function Furniture({ mode }: { mode: ViewMode }) {
  if (mode === "blueprint") return null;

  return (
    <>
      <group position={[-2.3, 0.45, -0.45]} rotation-y={0.12}>
        <mesh castShadow><boxGeometry args={[2.45, 0.45, 1.05]} /><meshStandardMaterial color="hsl(44, 35%, 84%)" roughness={0.9} /></mesh>
        <mesh position={[0, 0.42, 0.42]} castShadow><boxGeometry args={[2.45, 0.7, 0.2]} /><meshStandardMaterial color="hsl(44, 35%, 88%)" /></mesh>
      </group>
      <mesh position={[-2.25, 0.28, 1.05]} castShadow>
        <cylinderGeometry args={[0.72, 0.82, 0.22, 32]} />
        <meshStandardMaterial color="hsl(41, 52%, 65%)" metalness={0.55} roughness={0.35} />
      </mesh>
      <group position={[1.5, 0.42, -1.55]}>
        <mesh castShadow><boxGeometry args={[2.35, 0.34, 1.5]} /><meshStandardMaterial color="hsl(0, 0%, 100%)" /></mesh>
        <mesh position={[0, 0.32, -0.58]} castShadow><boxGeometry args={[2.2, 0.18, 0.18]} /><meshStandardMaterial color="hsl(207, 70%, 9%)" /></mesh>
      </group>
      <group position={[1.4, 0.48, 1.65]}>
        <mesh castShadow><boxGeometry args={[1.65, 0.78, 0.75]} /><meshStandardMaterial color="hsl(207, 24%, 23%)" roughness={0.7} /></mesh>
        <mesh position={[0, 0.48, 0]} castShadow><boxGeometry args={[1.3, 0.12, 0.5]} /><meshStandardMaterial color="hsl(44, 35%, 94%)" /></mesh>
      </group>
      {[-3.15, -1.35, 0.6, 2.35].map((x) => (
        <mesh key={x} position={[x, 1.65, -2.87]} castShadow>
          <boxGeometry args={[0.78, 1.05, 0.08]} />
          <meshStandardMaterial color="hsl(202, 55%, 76%)" metalness={0.15} roughness={0.2} />
        </mesh>
      ))}
    </>
  );
}

function Apartment({ mode }: InteractivePropertyModelProps) {
  const blueprint = mode === "blueprint";
  const wallMaterial = useMemo(() => ({
    color: blueprint ? "hsl(41, 52%, 65%)" : "hsl(44, 35%, 94%)",
    opacity: blueprint ? 0.62 : 1,
    transparent: blueprint,
    wireframe: blueprint,
  }), [blueprint]);

  return (
    <group rotation-y={-0.12}>
      {rooms.map((room, index) => (
        <mesh key={index} position={room.position} receiveShadow>
          <boxGeometry args={room.size} />
          <meshStandardMaterial
            color={blueprint ? "hsl(207, 58%, 18%)" : index === 0 ? "hsl(35, 30%, 72%)" : "hsl(44, 35%, 87%)"}
            roughness={blueprint ? 0.55 : 0.9}
            metalness={blueprint ? 0.25 : 0}
          />
        </mesh>
      ))}
      {walls.map((wall, index) => (
        <mesh key={index} position={wall.position} castShadow receiveShadow>
          <boxGeometry args={wall.size} />
          <meshStandardMaterial {...wallMaterial} />
        </mesh>
      ))}
      {blueprint && (
        <gridHelper args={[10, 20, "hsl(41, 52%, 65%)", "hsl(207, 35%, 29%)"]} position={[0, 0.02, 0]} />
      )}
      <Furniture mode={mode} />
    </group>
  );
}

export function InteractivePropertyModel({ mode }: InteractivePropertyModelProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [8.6, 7.2, 9.5], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={[mode === "blueprint" ? "hsl(207, 70%, 9%)" : "hsl(207, 45%, 14%)"]} />
      <fog attach="fog" args={["hsl(207, 70%, 9%)", 15, 25]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7]} intensity={2.1} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <Apartment mode={mode} />
      <ContactShadows position={[0, -0.04, 0]} opacity={0.45} scale={15} blur={2.5} far={6} />
      <Environment>
        <Lightformer intensity={2.2} position={[0, 6, 1]} scale={[10, 10, 1]} />
        <Lightformer intensity={1.4} color="hsl(41, 52%, 65%)" position={[-5, 2, 1]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
      </Environment>
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={8}
        maxDistance={17}
        minPolarAngle={0.45}
        maxPolarAngle={1.22}
        target={[0, 0.4, 0]}
        enablePan={false}
      />
    </Canvas>
  );
}