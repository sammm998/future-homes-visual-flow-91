import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

type ViewMode = "blueprint" | "finished";

interface InteractivePropertyModelProps {
  mode: ViewMode;
  immersive?: boolean;
}

const rooms = [
  { position: [-2.5, 0.08, 0] as [number, number, number], size: [3.8, 0.16, 5.8] as [number, number, number] },
  { position: [1.5, 0.08, -1.55] as [number, number, number], size: [3.8, 0.16, 2.7] as [number, number, number] },
  { position: [1.5, 0.08, 1.65] as [number, number, number], size: [3.8, 0.16, 3.3] as [number, number, number] },
];

const walls = [
  { position: [0, 1.25, -3] as [number, number, number], size: [8, 2.5, 0.12] as [number, number, number] },
  { position: [-4, 1.25, 0] as [number, number, number], size: [0.12, 2.5, 6] as [number, number, number] },
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
      <mesh position={[-2.25, 0.17, 0.15]} receiveShadow>
        <boxGeometry args={[3.25, 0.08, 2.3]} />
        <meshStandardMaterial color="#d8c8aa" roughness={0.95} />
      </mesh>
      <mesh position={[-2.25, 0.28, 1.05]} castShadow>
        <cylinderGeometry args={[0.72, 0.82, 0.22, 32]} />
        <meshStandardMaterial color="hsl(41, 52%, 65%)" metalness={0.55} roughness={0.35} />
      </mesh>
      <group position={[1.5, 0.42, -1.55]}>
        <mesh castShadow><boxGeometry args={[2.35, 0.34, 1.5]} /><meshStandardMaterial color="hsl(0, 0%, 100%)" /></mesh>
        <mesh position={[0, 0.32, -0.58]} castShadow><boxGeometry args={[2.2, 0.18, 0.18]} /><meshStandardMaterial color="hsl(207, 70%, 9%)" /></mesh>
        <mesh position={[0, 0.24, 0]} castShadow><boxGeometry args={[2.05, 0.12, 1.34]} /><meshStandardMaterial color="#d8c8aa" roughness={0.95} /></mesh>
        <mesh position={[-0.52, 0.42, -0.25]} rotation-z={-0.08} castShadow><boxGeometry args={[0.72, 0.15, 0.45]} /><meshStandardMaterial color="#f5f2ea" /></mesh>
        <mesh position={[0.52, 0.42, -0.25]} rotation-z={0.08} castShadow><boxGeometry args={[0.72, 0.15, 0.45]} /><meshStandardMaterial color="#f5f2ea" /></mesh>
      </group>
      <mesh position={[1.5, 0.16, -1.35]} receiveShadow>
        <boxGeometry args={[3.15, 0.06, 2.55]} />
        <meshStandardMaterial color="#bba98e" roughness={1} />
      </mesh>
      {[-0.05, 3.05].map((x) => (
        <group key={x} position={[x, 0.38, -2.05]}>
          <mesh castShadow><boxGeometry args={[0.55, 0.54, 0.5]} /><meshStandardMaterial color="#17394b" roughness={0.72} /></mesh>
          <mesh position={[0, 0.55, 0]} castShadow><cylinderGeometry args={[0.07, 0.09, 0.65, 18]} /><meshStandardMaterial color="#d5b777" metalness={0.7} /></mesh>
          <mesh position={[0, 0.9, 0]} castShadow><coneGeometry args={[0.28, 0.42, 24, 1, true]} /><meshStandardMaterial color="#f5f2ea" side={THREE.DoubleSide} /></mesh>
        </group>
      ))}
      <mesh position={[1.5, 1.65, -2.88]} castShadow>
        <boxGeometry args={[1.55, 0.9, 0.06]} />
        <meshStandardMaterial color="#d5b777" metalness={0.2} roughness={0.55} />
      </mesh>
      <group position={[1.4, 0.48, 1.65]}>
        <mesh castShadow><boxGeometry args={[1.65, 0.78, 0.75]} /><meshStandardMaterial color="hsl(207, 24%, 23%)" roughness={0.7} /></mesh>
        <mesh position={[0, 0.48, 0]} castShadow><boxGeometry args={[1.3, 0.12, 0.5]} /><meshStandardMaterial color="hsl(44, 35%, 94%)" /></mesh>
      </group>
      <group position={[2.95, 0.58, 1.65]}>
        <mesh castShadow><cylinderGeometry args={[0.36, 0.42, 1.1, 24]} /><meshStandardMaterial color="#d5b777" metalness={0.5} roughness={0.32} /></mesh>
        <mesh position={[0, 0.72, 0]} castShadow><sphereGeometry args={[0.42, 24, 16]} /><meshStandardMaterial color="#f5f2ea" emissive="#d5b777" emissiveIntensity={0.18} /></mesh>
      </group>
      <group position={[2.7, 0.48, -2.2]}>
        <mesh castShadow><boxGeometry args={[1.55, 0.82, 0.58]} /><meshStandardMaterial color="#e7e1d4" roughness={0.7} /></mesh>
        <mesh position={[0, 0.52, 0]} castShadow><boxGeometry args={[1.25, 0.12, 0.38]} /><meshStandardMaterial color="#071827" /></mesh>
      </group>
      <group position={[-3.25, 0.6, 2.15]}>
        <mesh castShadow><cylinderGeometry args={[0.32, 0.42, 0.65, 20]} /><meshStandardMaterial color="#d5b777" metalness={0.25} roughness={0.5} /></mesh>
        {[0, 1, 2, 3, 4].map((leaf) => (
          <mesh key={leaf} position={[Math.sin(leaf * 1.25) * 0.3, 0.62 + (leaf % 2) * 0.18, Math.cos(leaf * 1.25) * 0.3]} rotation-z={0.35} castShadow>
            <sphereGeometry args={[0.18, 16, 12]} />
            <meshStandardMaterial color="#31594a" roughness={0.9} />
          </mesh>
        ))}
      </group>
      <mesh position={[-0.35, 2.35, -0.5]} castShadow>
        <cylinderGeometry args={[0.34, 0.5, 0.42, 24]} />
        <meshStandardMaterial color="#d5b777" metalness={0.65} roughness={0.3} />
      </mesh>
      {[-3.15, -1.35, 0.6, 2.35].map((x) => (
        <mesh key={x} position={[x, 1.65, -2.87]} castShadow>
          <boxGeometry args={[0.78, 1.05, 0.08]} />
          <meshStandardMaterial color="hsl(202, 55%, 76%)" metalness={0.15} roughness={0.2} />
        </mesh>
      ))}
    </>
  );
}

function CameraRig({ immersive }: { immersive: boolean }) {
  const { camera } = useThree();
  const destination = useMemo(
    () => new THREE.Vector3(...(immersive ? [-2.3, 2.05, 4.6] : [8.6, 7.2, 9.5]) as [number, number, number]),
    [immersive],
  );

  useEffect(() => {
    if (immersive) camera.lookAt(-2.25, 0.55, -0.45);
  }, [camera, immersive]);

  useFrame((_, delta) => {
    camera.position.lerp(destination, 1 - Math.exp(-3.8 * Math.min(delta, 0.05)));
  });

  return null;
}

function Apartment({ mode }: InteractivePropertyModelProps) {
  const blueprint = mode === "blueprint";
  const wallMaterial = useMemo(() => ({
    color: blueprint ? "#d5b777" : "#f5f2ea",
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
            color={blueprint ? "#12334a" : index === 0 ? "#cbb89c" : "#e7e1d4"}
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
        <gridHelper args={[10, 20, "#d5b777", "#284a60"]} position={[0, 0.02, 0]} />
      )}
      <Furniture mode={mode} />
    </group>
  );
}

export function InteractivePropertyModel({ mode, immersive = false }: InteractivePropertyModelProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [8.6, 7.2, 9.5], fov: 40 }}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={[mode === "blueprint" ? "#071827" : "#102c3c"]} />
      <fog attach="fog" args={["#071827", 15, 25]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7]} intensity={2.1} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <Apartment mode={mode} />
      <CameraRig immersive={immersive} />
      <ContactShadows position={[0, -0.04, 0]} opacity={0.45} scale={15} blur={2.5} far={6} />
      <Environment>
        <Lightformer intensity={2.2} position={[0, 6, 1]} scale={[10, 10, 1]} />
        <Lightformer intensity={1.4} color="#d5b777" position={[-5, 2, 1]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
      </Environment>
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={immersive ? 0.4 : 8}
        maxDistance={immersive ? 7 : 17}
        minPolarAngle={immersive ? 1.15 : 0.45}
        maxPolarAngle={immersive ? 1.85 : 1.22}
        target={immersive ? [-2.25, 0.55, -0.45] : [0, 0.4, 0]}
        enablePan={false}
      />
    </Canvas>
  );
}