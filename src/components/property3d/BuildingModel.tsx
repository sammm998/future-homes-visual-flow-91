import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import type { BuildingSpec } from "@/lib/building3d";

const FLOOR_H = 3.1;

function useFacadeTexture(color: string, glass: string, accent: string, cols: number) {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512; c.height = 128;
    const g = c.getContext("2d")!;
    g.fillStyle = color; g.fillRect(0, 0, 512, 128);
    const w = 512 / cols;
    for (let i = 0; i < cols; i++) {
      const grad = g.createLinearGradient(0, 20, 0, 118);
      grad.addColorStop(0, "#dfe9ef"); grad.addColorStop(0.35, glass); grad.addColorStop(1, "#22303a");
      g.fillStyle = grad; g.fillRect(i * w + w * 0.12, 18, w * 0.76, 100);
      g.fillStyle = accent; g.fillRect(i * w + w * 0.5 - 1.5, 18, 3, 100);
      g.fillRect(i * w + w * 0.12, 16, w * 0.76, 4);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    return t;
  }, [color, glass, accent, cols]);
}

function Block({ s, x }: { s: BuildingSpec; x: number }) {
  const cols = Math.max(3, Math.round(s.width / 3.2));
  const colsD = Math.max(2, Math.round(s.depth / 3.2));
  const texW = useFacadeTexture(s.facadeColor, s.glassColor, s.accentColor, cols);
  const texD = useFacadeTexture(s.facadeColor, s.glassColor, s.accentColor, colsD);
  const plain = new THREE.MeshStandardMaterial({ color: s.facadeColor, roughness: 0.85 });
  const mats = [
    new THREE.MeshStandardMaterial({ map: texD, roughness: 0.4, metalness: 0.1 }),
    new THREE.MeshStandardMaterial({ map: texD, roughness: 0.4, metalness: 0.1 }),
    plain, plain,
    new THREE.MeshStandardMaterial({ map: texW, roughness: 0.4, metalness: 0.1 }),
    new THREE.MeshStandardMaterial({ map: texW, roughness: 0.4, metalness: 0.1 }),
  ];
  const H = s.floors * FLOOR_H;
  const bal = s.balconies !== "none";
  return (
    <group position={[x, 0, 0]}>
      {Array.from({ length: s.floors }).map((_, f) => (
        <group key={f} position={[0, f * FLOOR_H, 0]}>
          <mesh castShadow receiveShadow position={[0, FLOOR_H / 2, 0]} material={mats}>
            <boxGeometry args={[s.width, FLOOR_H - 0.25, s.depth]} />
          </mesh>
          <mesh castShadow position={[0, 0.12, 0]}>
            <boxGeometry args={[s.width + (bal ? 2.4 : 0.3), 0.25, s.depth + (bal ? 2.4 : 0.3)]} />
            <meshStandardMaterial color={s.facadeColor} roughness={0.7} />
          </mesh>
          {bal && f > 0 && (
            <mesh position={[0, 0.75, s.depth / 2 + 1.15]}>
              <boxGeometry args={[s.width + 2.3, 1, 0.04]} />
              <meshPhysicalMaterial color="#cfe3ea" transmission={0.6} transparent opacity={0.35} roughness={0.05} />
            </mesh>
          )}
        </group>
      ))}
      <mesh castShadow position={[0, H + 0.5, 0]}>
        <boxGeometry args={[s.width + 0.4, 1, s.depth + 0.4]} />
        <meshStandardMaterial color={s.accentColor} roughness={0.6} />
      </mesh>
      {s.roof === "pitched" && (
        <mesh castShadow position={[0, H + 2.5, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[Math.max(s.width, s.depth) * 0.72, 4, 4]} />
          <meshStandardMaterial color="#8a4b35" roughness={0.8} />
        </mesh>
      )}
      {s.roof === "terrace" && (
        <mesh position={[s.width / 4, H + 1.6, 0]}><boxGeometry args={[s.width / 3, 1.2, s.depth / 2]} /><meshStandardMaterial color={s.facadeColor} /></mesh>
      )}
    </group>
  );
}

function Tree({ p, h }: { p: [number, number]; h: number }) {
  return (
    <group position={[p[0], 0, p[1]]}>
      <mesh castShadow position={[0, h * 0.35, 0]}><cylinderGeometry args={[0.15, 0.22, h * 0.7]} /><meshStandardMaterial color="#6b4e34" /></mesh>
      <mesh castShadow position={[0, h * 0.85, 0]}><icosahedronGeometry args={[h * 0.32, 1]} /><meshStandardMaterial color="#4f7a3a" roughness={0.9} flatShading /></mesh>
    </group>
  );
}

export default function BuildingModel({ spec }: { spec: BuildingSpec }) {
  const gap = 6;
  const total = spec.blocks * spec.width + (spec.blocks - 1) * gap;
  const xs = Array.from({ length: spec.blocks }, (_, i) => -total / 2 + spec.width / 2 + i * (spec.width + gap));
  const H = spec.floors * FLOOR_H;
  const dist = Math.max(total, H) * 1.6 + 20;
  const treeCount = { low: 6, medium: 14, high: 24 }[spec.greenery];
  const trees = useMemo(() => Array.from({ length: treeCount }, (_, i) => {
    const a = (i / treeCount) * Math.PI * 2;
    const r = Math.max(total, spec.depth) / 2 + 7 + (i % 3) * 2.5;
    return { p: [Math.cos(a) * r, Math.sin(a) * r * 0.8] as [number, number], h: 4 + (i % 4) };
  }), [treeCount, total, spec.depth]);
  return (
    <Canvas shadows camera={{ position: [dist * 0.7, dist * 0.45, dist * 0.8], fov: 40 }} dpr={[1, 2]} data-scene-ready>
      <color attach="background" args={["#cfdbe4"]} />
      <fog attach="fog" args={["#cfdbe4", dist * 2, dist * 5]} />
      <hemisphereLight args={["#fff8ee", "#7a8a6a", 0.6]} />
      <directionalLight castShadow position={[dist * 0.5, dist, dist * 0.3]} intensity={2.2} shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-dist} shadow-camera-right={dist} shadow-camera-top={dist} shadow-camera-bottom={-dist} />
      <Environment resolution={256}>
        <Lightformer intensity={2} position={[0, 10, 0]} scale={[20, 20, 1]} rotation-x={Math.PI / 2} />
        <Lightformer intensity={1} color="#bcd" position={[-10, 2, -5]} rotation-y={Math.PI / 2} scale={[30, 2, 1]} />
      </Environment>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[dist * 3, 64]} /><meshStandardMaterial color="#9fb07f" roughness={1} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[total + 10, spec.depth + 12]} /><meshStandardMaterial color="#d8d0c2" roughness={0.9} />
      </mesh>
      {spec.hasPool && (
        <RoundedBox args={[Math.min(total * 0.6, 18), 0.1, 5]} radius={0.05} position={[0, 0.05, spec.depth / 2 + 4.5]}>
          <meshPhysicalMaterial color="#3fa7c9" roughness={0.05} clearcoat={1} />
        </RoundedBox>
      )}
      {xs.map((x, i) => <Block key={i} s={spec} x={x} />)}
      {trees.map((t, i) => <Tree key={i} {...t} />)}
      <ContactShadows position={[0, 0.03, 0]} opacity={0.35} scale={dist * 2} blur={2.5} />
      <OrbitControls makeDefault enableDamping maxPolarAngle={Math.PI / 2.15} minDistance={10} maxDistance={dist * 2.5} target={[0, H * 0.4, 0]} autoRotate autoRotateSpeed={0.4} />
    </Canvas>
  );
}
