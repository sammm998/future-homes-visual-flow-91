import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls, useTexture } from "@react-three/drei";
import { Component, Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import * as THREE from "three";
import { squareToQuad, type BuildingSpec, type FacadePhoto } from "@/lib/building3d";
import { getOptimizedImageUrl } from "@/utils/imageOptimization";

/* ------------------------------------------------------------------ */
/* Dimensions                                                          */
/* ------------------------------------------------------------------ */

const FLOOR_H = 3.15;
const SLAB_H = 0.3;
const PODIUM_FLOOR_H = 4.4;

/* ------------------------------------------------------------------ */
/* Procedural textures                                                 */
/* ------------------------------------------------------------------ */

const CELL = 128;

type FacadeStyle = {
  facade: string;
  secondary: string;
  glass: string;
  accent: string;
  material: BuildingSpec["material"];
  windowStyle: BuildingSpec["windowStyle"];
  windowRatio: number;
};

function mix(a: string, b: string, t: number) {
  return `#${new THREE.Color(a).lerp(new THREE.Color(b), t).getHexString()}`;
}

/** Wall finish (render, stone, wood …) painted into a 2D context. */
function paintWall(g: CanvasRenderingContext2D, w: number, h: number, s: FacadeStyle, seed: number) {
  g.fillStyle = s.material === "glass" ? mix(s.glass, "#1d2a33", 0.35) : s.facade;
  g.fillRect(0, 0, w, h);
  let r = seed * 9301 + 49297;
  const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
  if (s.material === "stone" || s.material === "brick") {
    const bh = s.material === "brick" ? 8 : 18;
    const bw = s.material === "brick" ? 22 : 46;
    for (let y = 0; y < h; y += bh) {
      for (let x = -((y / bh) % 2) * (bw / 2); x < w; x += bw) {
        g.fillStyle = mix(s.facade, rnd() > 0.5 ? "#ffffff" : "#000000", rnd() * 0.12);
        g.fillRect(x + 1, y + 1, bw - 2, bh - 2);
      }
    }
  } else if (s.material === "wood") {
    for (let x = 0; x < w; x += 9) {
      g.fillStyle = mix(s.facade, "#000000", 0.08 + rnd() * 0.12);
      g.fillRect(x, 0, 2, h);
    }
  } else {
    // Render / concrete: fine speckle so large walls are not flat plastic.
    const n = s.material === "concrete" ? 900 : 400;
    for (let i = 0; i < n; i++) {
      g.fillStyle = mix(s.facade, rnd() > 0.5 ? "#ffffff" : "#000000", 0.05 + rnd() * 0.06);
      g.fillRect(rnd() * w, rnd() * h, 2, 2);
    }
  }
}

/** Glass pane with a sky reflection, frame and mullion. */
function paintWindow(g: CanvasRenderingContext2D, rg: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, s: FacadeStyle) {
  const grad = g.createLinearGradient(x, y, x + w * 0.4, y + h);
  grad.addColorStop(0, mix(s.glass, "#f2f7fb", 0.65));
  grad.addColorStop(0.45, s.glass);
  grad.addColorStop(1, mix(s.glass, "#0c1419", 0.6));
  g.fillStyle = grad;
  g.fillRect(x, y, w, h);
  // soft reflection streak
  g.fillStyle = "rgba(255,255,255,0.14)";
  g.beginPath();
  g.moveTo(x + w * 0.15, y + h);
  g.lineTo(x + w * 0.45, y);
  g.lineTo(x + w * 0.62, y);
  g.lineTo(x + w * 0.32, y + h);
  g.fill();
  // interior hint: curtains / ceiling line
  g.fillStyle = "rgba(255,244,225,0.10)";
  g.fillRect(x, y, w, h * 0.12);
  // frame + mullion
  g.strokeStyle = s.accent;
  g.lineWidth = 3;
  g.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
  g.fillStyle = s.accent;
  g.fillRect(x + w / 2 - 1.5, y, 3, h);
  rg.fillStyle = "#1a1a1a"; // glossy glass
  rg.fillRect(x, y, w, h);
  rg.fillStyle = "#808080";
  rg.fillRect(x + w / 2 - 1.5, y, 3, h);
}

/** One storey of facade with `cols` window bays (colour + roughness maps). */
function makeFloorTextures(cols: number, s: FacadeStyle, seed: number) {
  const w = cols * CELL;
  const h = CELL;
  const c = document.createElement("canvas");
  const rc = document.createElement("canvas");
  c.width = rc.width = w;
  c.height = rc.height = h;
  const g = c.getContext("2d")!;
  const rg = rc.getContext("2d")!;
  paintWall(g, w, h, s, seed);
  rg.fillStyle = s.material === "glass" ? "#303030" : "#dcdcdc";
  rg.fillRect(0, 0, w, h);

  if (s.windowStyle === "ribbon") {
    const top = h * 0.22;
    const bh = h * (0.32 + s.windowRatio * 0.4);
    g.fillStyle = s.secondary;
    g.fillRect(0, top + bh, w, h - top - bh);
    for (let i = 0; i < cols; i++) paintWindow(g, rg, i * CELL, top, CELL, bh, s);
  } else {
    const ftc = s.windowStyle === "floor_to_ceiling";
    const mx = (ftc ? 0.5 - s.windowRatio / 2 : 0.5 - s.windowRatio * 0.32) * CELL;
    const top = ftc ? h * 0.05 : h * 0.24;
    const bottom = ftc ? h * 0.97 : h * 0.8;
    for (let i = 0; i < cols; i++) {
      paintWindow(g, rg, i * CELL + mx, top, CELL - 2 * mx, bottom - top, s);
      if (!ftc) {
        g.fillStyle = mix(s.facade, "#000000", 0.18); // sill shadow
        g.fillRect(i * CELL + mx - 3, bottom, CELL - 2 * mx + 6, 4);
      }
    }
  }
  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const roughnessMap = new THREE.CanvasTexture(rc);
  return { map, roughnessMap };
}

/** Street-level shopfront / lobby glazing for podiums. */
function makePodiumTexture(cols: number, color: string, warm: boolean) {
  const c = document.createElement("canvas");
  c.width = cols * CELL;
  c.height = CELL;
  const g = c.getContext("2d")!;
  g.fillStyle = color;
  g.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < cols; i++) {
    const grad = g.createLinearGradient(0, 18, 0, CELL);
    grad.addColorStop(0, warm ? "#f6dfb4" : "#cfdde6");
    grad.addColorStop(1, warm ? "#a9784a" : "#3c4f5c");
    g.fillStyle = grad;
    g.fillRect(i * CELL + 6, 18, CELL - 12, CELL - 22);
    g.fillStyle = color;
    g.fillRect(i * CELL + CELL / 2 - 2, 18, 4, CELL - 22);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeStripeTexture(a: string, b: string, stripes: number, vertical = false) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  for (let i = 0; i < stripes; i++) {
    g.fillStyle = i % 2 ? a : b;
    if (vertical) g.fillRect((i * 256) / stripes, 0, 256 / stripes, 256);
    else g.fillRect(0, (i * 256) / stripes, 256, 256 / stripes);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

function makeTileTexture(base: string, joint: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = joint;
  g.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
    g.fillStyle = mix(base, (x + y) % 2 ? "#ffffff" : "#000000", 0.04);
    g.fillRect(x * 64 + 1.5, y * 64 + 1.5, 61, 61);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Floor plate with rounded corners in plan (curved balcony ends). */
function roundedSlabGeometry(w: number, d: number, r: number, h: number) {
  const rr = Math.min(r, w / 2 - 0.01, d / 2 - 0.01);
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2 + rr, -d / 2);
  shape.lineTo(w / 2 - rr, -d / 2);
  shape.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + rr);
  shape.lineTo(w / 2, d / 2 - rr);
  shape.quadraticCurveTo(w / 2, d / 2, w / 2 - rr, d / 2);
  shape.lineTo(-w / 2 + rr, d / 2);
  shape.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - rr);
  shape.lineTo(-w / 2, -d / 2 + rr);
  shape.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + rr, -d / 2);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false, curveSegments: 10 });
  geo.rotateX(-Math.PI / 2); // extrude upwards, plan in XZ
  return geo;
}

/** Disposes GPU resources created outside JSX when a component unmounts. */
function useDisposable<T extends { dispose: () => void }>(items: T[]) {
  useEffect(() => () => items.forEach((i) => i.dispose()), [items]);
}

/* ------------------------------------------------------------------ */
/* Photo facades                                                       */
/* ------------------------------------------------------------------ */

/** Same-origin, resized URL for a listing photo so WebGL may read it. */
function photoUrl(src: string) {
  const resized = getOptimizedImageUrl(src, 2000, 85);
  if (typeof window === "undefined") return resized;
  try {
    const u = new URL(resized, window.location.href);
    if (u.pathname.startsWith("/api/public/media/")) return `${u.pathname}${u.search}`;
  } catch {
    /* keep as is */
  }
  return resized;
}

/**
 * Samples the listing photo through the facade's homography, so the real
 * facade (windows, balconies, materials) appears straightened on the model.
 */
function makePhotoMaterial(texture: THREE.Texture, facade: FacadePhoto, shade: number) {
  const h = squareToQuad(facade.quad);
  const H = new THREE.Matrix3().set(h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7], h[8]);
  return new THREE.ShaderMaterial({
    uniforms: { map: { value: texture }, H: { value: H }, shade: { value: shade } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D map;
      uniform mat3 H;
      uniform float shade;
      varying vec2 vUv;
      void main() {
        vec3 p = H * vec3(vUv.x, 1.0 - vUv.y, 1.0);
        vec2 q = p.xy / p.z;
        vec4 c = texture2D(map, vec2(q.x, 1.0 - q.y));
        gl_FragColor = vec4(c.rgb * shade, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
}

class Fallback extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/* ------------------------------------------------------------------ */
/* Building parts                                                      */
/* ------------------------------------------------------------------ */

type WingProps = {
  s: BuildingSpec;
  width: number;
  depth: number;
  floors: number;
  seed: number;
};

const styleOf = (s: BuildingSpec): FacadeStyle => ({
  facade: s.facadeColor,
  secondary: s.secondaryColor,
  glass: s.glassColor,
  accent: s.accentColor,
  material: s.material,
  windowStyle: s.windowStyle,
  windowRatio: s.windowRatio,
});

function Railing({ length, s, position, rotationY = 0 }: { length: number; s: BuildingSpec; position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {s.railing === "solid" ? (
        <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
          <boxGeometry args={[length, 1.1, 0.14]} />
          <meshStandardMaterial color={s.facadeColor} roughness={0.85} />
        </mesh>
      ) : (
        <>
          {s.railing === "glass" ? (
            <mesh position={[0, 0.55, 0]}>
              <boxGeometry args={[length, 1.05, 0.03]} />
              <meshStandardMaterial color={mix(s.glassColor, "#dbeaf0", 0.5)} transparent opacity={0.32} roughness={0.05} metalness={0.2} depthWrite={false} />
            </mesh>
          ) : (
            <mesh position={[0, 0.55, 0]}>
              <boxGeometry args={[length, 0.05, 0.05]} />
              <meshStandardMaterial color={s.accentColor} metalness={0.6} roughness={0.35} />
            </mesh>
          )}
          <mesh castShadow position={[0, 1.08, 0]}>
            <boxGeometry args={[length, 0.06, 0.08]} />
            <meshStandardMaterial color={s.accentColor} metalness={0.6} roughness={0.35} />
          </mesh>
        </>
      )}
    </group>
  );
}

/** A storey-by-storey modelled wing: slabs, glazing, balconies, railings and roof. */
function ModelledWing({ s, width, depth, floors, seed }: WingProps) {
  const style = useMemo(() => styleOf(s), [s]);
  const colsW = Math.max(2, Math.round(width / 3.4));
  const colsD = Math.max(2, Math.round(depth / 3.4));
  const texW = useMemo(() => makeFloorTextures(colsW, style, seed), [colsW, style, seed]);
  const texD = useMemo(() => makeFloorTextures(colsD, style, seed + 1), [colsD, style, seed]);
  useDisposable(useMemo(() => [texW.map, texW.roughnessMap, texD.map, texD.roughnessMap], [texW, texD]));

  const villa = s.kind === "villa" || s.kind === "townhouses";
  const balcony = s.balconies;
  const out = balcony === "projecting" ? 1.8 : balcony === "wraparound" ? 1.8 : 0;
  const inset = balcony === "recessed" ? 1.4 : 0;
  const wallW = width - inset * 2;
  const wallD = depth - inset * 2;

  const wallMats = useMemo(() => {
    const m = (t: { map: THREE.Texture; roughnessMap: THREE.Texture }) =>
      new THREE.MeshStandardMaterial({ map: t.map, roughnessMap: t.roughnessMap, roughness: 1, metalness: 0.15, envMapIntensity: 1.1 });
    const top = new THREE.MeshStandardMaterial({ color: s.facadeColor, roughness: 0.9 });
    return [m(texD), m(texD), top, top, m(texW), m(texW)];
  }, [texW, texD, s.facadeColor]);
  useDisposable(wallMats);

  const slabW = width + (balcony === "wraparound" ? out * 2 : 0.3) + (villa ? 0.8 : 0);
  const slabD = depth + (balcony === "projecting" || balcony === "wraparound" ? out * 2 : 0.3) + (villa ? 0.8 : 0);
  const rounded = s.corners === "rounded";
  const H = floors * FLOOR_H;
  const slabGeo = useMemo(() => (rounded ? roundedSlabGeometry(slabW, slabD, Math.min(3.2, out + 1.4), SLAB_H) : null), [rounded, slabW, slabD, out]);
  useDisposable(useMemo(() => (slabGeo ? [slabGeo] : []), [slabGeo]));
  const slabMat = useMemo(() => new THREE.MeshStandardMaterial({ color: mix(s.facadeColor, "#ffffff", 0.25), roughness: 0.8 }), [s.facadeColor]);
  useDisposable(useMemo(() => [slabMat], [slabMat]));

  return (
    <group>
      {Array.from({ length: floors }).map((_, f) => (
        <group key={f} position={[0, f * FLOOR_H, 0]}>
          {/* floor slab / balcony plate */}
          {slabGeo ? (
            <mesh castShadow receiveShadow geometry={slabGeo} material={slabMat} />
          ) : (
            <mesh castShadow receiveShadow position={[0, SLAB_H / 2, 0]} material={slabMat}>
              <boxGeometry args={[slabW, SLAB_H, slabD]} />
            </mesh>
          )}
          {/* glazed / rendered storey */}
          <mesh castShadow receiveShadow position={[0, SLAB_H + (FLOOR_H - SLAB_H) / 2, 0]} material={wallMats}>
            <boxGeometry args={[wallW, FLOOR_H - SLAB_H, wallD]} />
          </mesh>
          {/* balcony railings on the slab edge */}
          {f > 0 && balcony !== "none" && (
            <>
              <Railing s={s} length={slabW - (rounded ? 2 * Math.min(3.2, out + 1.4) : 0.2)} position={[0, SLAB_H, slabD / 2 - 0.08]} />
              <Railing s={s} length={slabW - (rounded ? 2 * Math.min(3.2, out + 1.4) : 0.2)} position={[0, SLAB_H, -slabD / 2 + 0.08]} />
              {(balcony === "wraparound" || balcony === "recessed") && (
                <>
                  <Railing s={s} length={slabD - (rounded ? 2 * Math.min(3.2, out + 1.4) : 0.2)} position={[slabW / 2 - 0.08, SLAB_H, 0]} rotationY={Math.PI / 2} />
                  <Railing s={s} length={slabD - (rounded ? 2 * Math.min(3.2, out + 1.4) : 0.2)} position={[-slabW / 2 + 0.08, SLAB_H, 0]} rotationY={Math.PI / 2} />
                </>
              )}
            </>
          )}
        </group>
      ))}
      <Roof s={s} width={width} depth={depth} slabW={slabW} slabD={slabD} height={H} />
    </group>
  );
}

function Roof({ s, width, depth, slabW, slabD, height }: { s: BuildingSpec; width: number; depth: number; slabW: number; slabD: number; height: number }) {
  const villa = s.kind === "villa" || s.kind === "townhouses";
  const overhang = villa ? 1.2 : 0.2;
  return (
    <group position={[0, height, 0]}>
      {s.roof === "pitched" ? (
        <mesh castShadow position={[0, 1.9, 0]} rotation={[0, Math.PI / 4, 0]} scale={[(width + 1.6) / Math.SQRT2, 1, (depth + 1.6) / Math.SQRT2]}>
          <coneGeometry args={[1, 3.8, 4, 1]} />
          <meshStandardMaterial color={s.roofColor} roughness={0.85} flatShading />
        </mesh>
      ) : (
        <>
          <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
            <boxGeometry args={[slabW + overhang, 0.4, slabD + overhang]} />
            <meshStandardMaterial color={mix(s.facadeColor, "#ffffff", 0.3)} roughness={0.8} />
          </mesh>
          {/* parapet */}
          {!villa && (
            <group position={[0, 0.95, 0]}>
              {[
                [0, slabD / 2, slabW, 0.18],
                [0, -slabD / 2, slabW, 0.18],
                [slabW / 2, 0, 0.18, slabD],
                [-slabW / 2, 0, 0.18, slabD],
              ].map(([x, z, w, d], i) => (
                <mesh key={i} castShadow position={[x, 0, z]}>
                  <boxGeometry args={[w, 1.1, d]} />
                  <meshStandardMaterial color={s.accentColor} roughness={0.7} />
                </mesh>
              ))}
            </group>
          )}
          {(s.roof === "terrace" || s.roof === "pergola") && (
            <group position={[width * 0.18, 0.4, 0]}>
              {s.roof === "terrace" && (
                <mesh castShadow position={[0, FLOOR_H / 2, 0]}>
                  <boxGeometry args={[width * 0.4, FLOOR_H, depth * 0.55]} />
                  <meshStandardMaterial color={s.facadeColor} roughness={0.85} />
                </mesh>
              )}
              {/* pergola slats */}
              {Array.from({ length: 9 }).map((_, i) => (
                <mesh key={i} castShadow position={[-width * 0.42 + i * (width * 0.1), FLOOR_H - 0.1, 0]}>
                  <boxGeometry args={[0.12, 0.25, depth * 0.62]} />
                  <meshStandardMaterial color={s.accentColor} roughness={0.6} />
                </mesh>
              ))}
              {[-1, 1].map((sx) => [-1, 1].map((sz) => (
                <mesh key={`${sx}${sz}`} castShadow position={[sx * width * 0.4 - width * 0.02, (FLOOR_H - 0.1) / 2, sz * depth * 0.29]}>
                  <boxGeometry args={[0.18, FLOOR_H - 0.1, 0.18]} />
                  <meshStandardMaterial color={s.accentColor} />
                </mesh>
              )))}
            </group>
          )}
          {!villa && (
            /* rooftop plant */
            <group position={[-width * 0.28, 0.9, -depth * 0.15]}>
              {[0, 1.6, 3.2].map((x) => (
                <mesh key={x} castShadow position={[x, 0, 0]}>
                  <boxGeometry args={[1.2, 1, 0.9]} />
                  <meshStandardMaterial color="#b9bcbd" metalness={0.3} roughness={0.5} />
                </mesh>
              ))}
            </group>
          )}
        </>
      )}
    </group>
  );
}

/** Wing whose walls show the straightened listing photos. */
function PhotoWing({ s, width, depth, floors, seed, left, right }: WingProps & { left?: FacadePhoto; right?: FacadePhoto }) {
  const urls = useMemo(() => [left?.image, right?.image].filter((u): u is string => !!u).map(photoUrl), [left, right]);
  const textures = useTexture(urls) as THREE.Texture[];
  const style = useMemo(() => styleOf(s), [s]);
  const height = floors * FLOOR_H;
  const colsW = Math.max(2, Math.round(width / 3.4));
  const colsD = Math.max(2, Math.round(depth / 3.4));
  const procedural = useMemo(() => {
    const a = makeFloorTextures(colsW, style, seed);
    const b = makeFloorTextures(colsD, style, seed + 1);
    for (const t of [a.map, a.roughnessMap, b.map, b.roughnessMap]) {
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(1, floors);
    }
    return { a, b };
  }, [colsW, colsD, style, seed, floors]);

  const materials = useMemo(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
    });
    const tex = (f?: FacadePhoto) => (f ? textures[urls.indexOf(photoUrl(f.image))] : undefined);
    const plain = (t: { map: THREE.Texture; roughnessMap: THREE.Texture }) =>
      new THREE.MeshStandardMaterial({ map: t.map, roughnessMap: t.roughnessMap, roughness: 1, metalness: 0.15 });
    const leftPhoto = left && tex(left);
    const rightPhoto = right && tex(right);
    const front = leftPhoto ? makePhotoMaterial(leftPhoto, left!, 1) : plain(procedural.a);
    const back = leftPhoto ? makePhotoMaterial(leftPhoto, left!, 0.86) : plain(procedural.a);
    // With only one photographed face the other faces reuse it, which reads
    // far closer to the real building than a generic window pattern.
    const sideSrc = right ?? left;
    const sideTex = rightPhoto ?? leftPhoto;
    const side = sideSrc && sideTex ? makePhotoMaterial(sideTex, sideSrc, 0.95) : plain(procedural.b);
    const sideBack = sideSrc && sideTex ? makePhotoMaterial(sideTex, sideSrc, 0.82) : plain(procedural.b);
    const top = new THREE.MeshStandardMaterial({ color: mix(s.facadeColor, "#ffffff", 0.2), roughness: 0.9 });
    return [side, sideBack, top, top, front, back];
  }, [textures, urls, left, right, procedural, s.facadeColor]);
  useDisposable(materials);
  useDisposable(useMemo(() => [procedural.a.map, procedural.a.roughnessMap, procedural.b.map, procedural.b.roughnessMap], [procedural]));

  return (
    <group>
      <mesh castShadow receiveShadow position={[0, height / 2, 0]} material={materials}>
        <boxGeometry args={[width, height, depth]} />
      </mesh>
      <Roof s={{ ...s, roof: s.roof === "pitched" ? "pitched" : "flat" }} width={width} depth={depth} slabW={width} slabD={depth} height={height} />
    </group>
  );
}

function Podium({ s, width, depth }: { s: BuildingSpec; width: number; depth: number }) {
  const h = s.podiumFloors * PODIUM_FLOOR_H;
  const tw = useMemo(() => makePodiumTexture(Math.max(3, Math.round(width / 4)), s.podiumColor, true), [width, s.podiumColor]);
  const td = useMemo(() => makePodiumTexture(Math.max(2, Math.round(depth / 4)), s.podiumColor, true), [depth, s.podiumColor]);
  const mats = useMemo(() => {
    const top = new THREE.MeshStandardMaterial({ color: "#7f8b78", roughness: 0.95 });
    const m = (t: THREE.Texture) => new THREE.MeshStandardMaterial({ map: t, roughness: 0.35, metalness: 0.1, emissive: new THREE.Color("#3a2a14"), emissiveIntensity: 0.35, emissiveMap: t });
    return [m(td), m(td), top, top, m(tw), m(tw)];
  }, [tw, td]);
  useDisposable(useMemo(() => [tw, td, ...mats], [tw, td, mats]));
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, h / 2, 0]} material={mats}>
        <boxGeometry args={[width, h, depth]} />
      </mesh>
      {/* canopy over the entrance */}
      <mesh castShadow position={[0, PODIUM_FLOOR_H * 0.78, depth / 2 + 1.4]}>
        <boxGeometry args={[width * 0.45, 0.25, 2.8]} />
        <meshStandardMaterial color={s.accentColor} roughness={0.5} metalness={0.3} />
      </mesh>
    </group>
  );
}

/** One block: optional podium, then either the photo-textured or the modelled body. */
function Block({ s, photo, seed }: { s: BuildingSpec; photo: boolean; seed: number }) {
  const podiumH = s.podiumFloors * PODIUM_FLOOR_H;
  const bodyFloors = Math.max(1, s.floors - s.podiumFloors);
  const pw = s.podiumFloors ? s.width + 6 : s.width;
  const pd = s.podiumFloors ? s.depth + 6 : s.depth;
  const left = s.facades.find((f) => f.side === "left");
  const right = s.facades.find((f) => f.side === "right");
  const modelled = <ModelledWing s={s} width={s.width} depth={s.depth} floors={bodyFloors} seed={seed} />;

  const wings: { x: number; z: number; rot: number; w: number; d: number }[] = [];
  if (s.footprint === "L" || s.footprint === "U") {
    const wingLen = s.width * 0.55;
    wings.push({ x: s.width / 2 - s.depth / 2, z: -(s.depth / 2 + wingLen / 2), rot: Math.PI / 2, w: wingLen, d: s.depth });
    if (s.footprint === "U") wings.push({ x: -(s.width / 2 - s.depth / 2), z: -(s.depth / 2 + wingLen / 2), rot: Math.PI / 2, w: wingLen, d: s.depth });
  }

  return (
    <group>
      {s.podiumFloors > 0 && <Podium s={s} width={pw} depth={pd} />}
      <group position={[0, podiumH, 0]}>
        {photo && (left || right) ? (
          <Fallback fallback={modelled}>
            <Suspense fallback={modelled}>
              <PhotoWing s={s} width={s.width} depth={s.depth} floors={bodyFloors} seed={seed} left={left} right={right} />
            </Suspense>
          </Fallback>
        ) : (
          modelled
        )}
        {wings.map((w, i) => (
          <group key={i} position={[w.x, 0, w.z]} rotation={[0, w.rot, 0]}>
            <ModelledWing s={s} width={w.w} depth={w.d} floors={bodyFloors} seed={seed + 10 + i} />
          </group>
        ))}
      </group>
    </group>
  );
}

/** Row of houses sharing walls, with a little rhythm in setbacks. */
function Townhouses({ s, seed }: { s: BuildingSpec; seed: number }) {
  const n = Math.max(3, Math.round(s.width / 7));
  const unit = s.width / n;
  const unitSpec = useMemo(() => ({ ...s, width: unit - 0.3, balconies: s.balconies === "none" ? ("none" as const) : ("projecting" as const) }), [s, unit]);
  return (
    <group>
      {Array.from({ length: n }).map((_, i) => (
        <group key={i} position={[-s.width / 2 + unit / 2 + i * unit, 0, i % 2 ? 1.6 : 0]}>
          <ModelledWing s={unitSpec} width={unit - 0.3} depth={s.depth} floors={s.floors} seed={seed + i} />
          <mesh castShadow position={[unit / 2 - 0.1, (s.floors * FLOOR_H) / 2, 0.6]}>
            <boxGeometry args={[0.35, s.floors * FLOOR_H + 0.6, s.depth + 2.6]} />
            <meshStandardMaterial color={i % 2 ? s.secondaryColor : s.accentColor} roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Site & landscape                                                    */
/* ------------------------------------------------------------------ */

/** One arching palm frond: a tapered strip that rises then droops (shared geometry). */
function makeFrondGeometry() {
  const L = 3.8;
  const steps = 10;
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = L * t;
    const y = 0.9 * t - 2.1 * t * t;
    const w = 0.08 + 0.55 * Math.sin(Math.PI * Math.min(1, t * 1.15)) * (1 - t * 0.35);
    pos.push(x, y, -w, x, y - 0.12 * t, 0, x, y, w);
  }
  for (let i = 0; i < steps; i++) {
    const a = i * 3;
    const b = a + 3;
    idx.push(a, b, a + 1, b, b + 1, a + 1, a + 1, b + 1, a + 2, b + 1, b + 2, a + 2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function Palm({ p, h, lean, frond }: { p: [number, number]; h: number; lean: number; frond: THREE.BufferGeometry }) {
  const segs = 6;
  return (
    <group position={[p[0], 0, p[1]]} rotation={[0, lean * 6, 0]}>
      {Array.from({ length: segs }).map((_, i) => {
        const t = i / segs;
        return (
          <mesh key={i} castShadow position={[lean * h * t * t, (h / segs) * (i + 0.5), 0]} rotation={[0, 0, -lean * 0.9 * t]}>
            <cylinderGeometry args={[0.15 - t * 0.04, 0.19 - t * 0.04, h / segs + 0.05, 7]} />
            <meshStandardMaterial color={i % 2 ? "#8b7355" : "#7a6449"} roughness={0.95} />
          </mesh>
        );
      })}
      <group position={[lean * h, h, 0]}>
        {Array.from({ length: 11 }).map((_, i) => (
          <mesh key={i} castShadow geometry={frond} rotation={[0, (i / 11) * Math.PI * 2 + i * 0.13, (i % 3) * 0.08]}>
            <meshStandardMaterial color={["#4c7a33", "#5d8c3e", "#3f6b2b"][i % 3]} roughness={0.8} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Tree({ p, h }: { p: [number, number]; h: number }) {
  return (
    <group position={[p[0], 0, p[1]]}>
      <mesh castShadow position={[0, h * 0.3, 0]}>
        <cylinderGeometry args={[0.14, 0.22, h * 0.6, 6]} />
        <meshStandardMaterial color="#6b4e34" roughness={0.95} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} castShadow position={[Math.sin(i * 2.1) * h * 0.12, h * (0.68 + i * 0.1), Math.cos(i * 2.1) * h * 0.12]}>
          <icosahedronGeometry args={[h * (0.26 - i * 0.04), 1]} />
          <meshStandardMaterial color={["#4f7a3a", "#5a8742", "#46703a"][i]} roughness={0.9} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function Pool({ position, length, width }: { position: [number, number, number]; length: number; width: number }) {
  const deck = useMemo(() => {
    const t = makeStripeTexture("#b88a5e", "#a97c52", 16, true);
    t.repeat.set(length / 4, 1);
    return t;
  }, [length]);
  useDisposable(useMemo(() => [deck], [deck]));
  return (
    <group position={position}>
      <mesh receiveShadow position={[0, 0.06, 0]}>
        <boxGeometry args={[length + 4, 0.12, width + 4.5]} />
        <meshStandardMaterial map={deck} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.13, -0.4]}>
        <boxGeometry args={[length, 0.04, width]} />
        <meshPhysicalMaterial color="#38a6c8" roughness={0.04} metalness={0.05} clearcoat={1} clearcoatRoughness={0.05} />
      </mesh>
      {Array.from({ length: Math.max(2, Math.floor(length / 2.6)) }).map((_, i) => (
        <group key={i} position={[-length / 2 + 1.2 + i * 2.6, 0.12, width / 2 + 1.2]}>
          <mesh castShadow position={[0, 0.25, 0]} rotation={[0.18, 0, 0]}>
            <boxGeometry args={[0.75, 0.12, 1.9]} />
            <meshStandardMaterial color="#f4f1ea" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Setting({ s, radius, orbit }: { s: BuildingSpec; radius: number; orbit: number }) {
  const paving = useMemo(() => {
    const t = makeTileTexture(s.setting === "city" ? "#cbc6bd" : "#ddd3c2", "#b9b0a2");
    t.repeat.set(12, 12);
    return t;
  }, [s.setting]);
  useDisposable(useMemo(() => [paving], [paving]));
  const ground = { seaside: "#a7b07a", city: "#8e9290", hills: "#93a26c", tropical: "#7fa25a", suburban: "#9fae78" }[s.setting];
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius * 6, 64]} />
        <meshStandardMaterial color={ground} roughness={1} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[radius * 1.6, radius * 1.6]} />
        <meshStandardMaterial map={paving} roughness={0.9} />
      </mesh>
      {s.setting === "seaside" && (
        <>
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, radius * 1.25]}>
            <planeGeometry args={[radius * 12, radius * 0.6]} />
            <meshStandardMaterial color="#e6d6b4" roughness={1} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, radius * 4.5]}>
            <planeGeometry args={[radius * 14, radius * 6]} />
            <meshPhysicalMaterial color="#2f7fa3" roughness={0.12} metalness={0.1} clearcoat={0.6} />
          </mesh>
        </>
      )}
      {(s.setting === "seaside" || s.setting === "hills") &&
        /* distant mountains (Taurus-style backdrop) */
        Array.from({ length: 7 }).map((_, i) => (
          <mesh key={i} position={[(i - 3) * radius * 1.9, 0, -radius * 5.5 - (i % 2) * radius]} scale={[radius * 1.6, radius * (0.55 + (i % 3) * 0.22), radius * 1.1]}>
            <coneGeometry args={[1, 1.6, 6, 1]} />
            <meshStandardMaterial color={i % 2 ? "#8a958f" : "#7d8a86"} roughness={1} flatShading />
          </mesh>
        ))}
      {s.setting === "city" &&
        /* neighbouring blocks for scale */
        Array.from({ length: 10 }).map((_, i) => {
          // Outside the camera's orbit, so they read as skyline and never hide the home.
          const a = (i / 10) * Math.PI * 2 + 0.3;
          const h = 14 + ((i * 7) % 5) * 9;
          return (
            <mesh key={i} receiveShadow position={[Math.cos(a) * orbit * 1.25, h / 2, Math.sin(a) * orbit * 1.25]}>
              <boxGeometry args={[16, h, 16]} />
              <meshStandardMaterial color={i % 2 ? "#c9ccce" : "#b8bcbf"} roughness={0.85} />
            </mesh>
          );
        })}
    </group>
  );
}

/** Soft Mediterranean sky: deep blue zenith fading to a hazy horizon. */
function SkyDome({ radius }: { radius: number }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: { top: { value: new THREE.Color("#4f8fd0") }, horizon: { value: new THREE.Color("#dbe7ee") }, ground: { value: new THREE.Color("#c9d3c4") } },
        vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `uniform vec3 top; uniform vec3 horizon; uniform vec3 ground; varying vec3 vDir;
          void main(){ float h = vDir.y; vec3 c = h > 0.0 ? mix(horizon, top, pow(min(1.0, h * 1.6), 0.7)) : mix(horizon, ground, min(1.0, -h * 4.0));
            gl_FragColor = vec4(c, 1.0);
            #include <colorspace_fragment>
          }`,
      }),
    [],
  );
  useDisposable(useMemo(() => [material], [material]));
  return (
    <mesh material={material} renderOrder={-1}>
      <sphereGeometry args={[radius, 32, 16]} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

export default function BuildingModel({ spec, photoFacades = true }: { spec: BuildingSpec; photoFacades?: boolean }) {
  const gap = 8;
  const perRow = spec.blockLayout === "grid" ? Math.ceil(spec.blocks / 2) : spec.blocks;
  const rows = spec.blockLayout === "grid" && spec.blocks > 1 ? 2 : 1;
  const spanX = perRow * spec.width + (perRow - 1) * gap + (spec.podiumFloors ? 6 : 0);
  const spanZ = rows * spec.depth + (rows - 1) * gap + (spec.footprint !== "rectangle" ? spec.width * 0.55 : 0);
  const positions = Array.from({ length: spec.blocks }, (_, i) => {
    const r = spec.blockLayout === "grid" ? Math.floor(i / perRow) : 0;
    const c = spec.blockLayout === "grid" ? i % perRow : i;
    const stagger = spec.blockLayout === "staggered" && c % 2 ? spec.depth * 0.6 : 0;
    return [-spanX / 2 + spec.width / 2 + c * (spec.width + gap) + (spec.podiumFloors ? 3 : 0), 0, -spanZ / 2 + spec.depth / 2 + r * (spec.depth + gap) + stagger] as [number, number, number];
  });
  const H = spec.floors * FLOOR_H + spec.podiumFloors * (PODIUM_FLOOR_H - FLOOR_H);
  const radius = Math.max(spanX, spanZ) / 2 + 14;
  // Fit the whole building (and its site) in the 38° vertical field of view.
  const dist = Math.max(radius * 2.3, H * 1.9) + 14;
  const [autoRotate, setAutoRotate] = useState(true);

  const greenCount = { low: 8, medium: 16, high: 28 }[spec.greenery];
  const plants = useMemo(
    () =>
      Array.from({ length: greenCount }, (_, i) => {
        const a = (i / greenCount) * Math.PI * 2 + 0.2;
        const r = radius * (0.72 + ((i * 37) % 10) / 40);
        const palm = spec.palms || spec.setting === "tropical" ? i % 3 !== 2 : false;
        return { p: [Math.cos(a) * r, Math.sin(a) * r] as [number, number], h: palm ? 7 + (i % 3) * 1.5 : 4.5 + (i % 4), palm, lean: ((i % 5) - 2) * 0.05 };
      }),
    [greenCount, radius, spec.palms, spec.setting],
  );
  const poolLength = Math.min(Math.max(spanX * 0.55, 10), 26);
  const frond = useMemo(makeFrondGeometry, []);
  useDisposable(useMemo(() => [frond], [frond]));

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [dist * 0.68, Math.max(dist * 0.3, H * 0.62), dist * 0.68], fov: 38, near: 0.5, far: dist * 22 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <SkyDome radius={dist * 9} />
      <fog attach="fog" args={["#dbe7ee", dist * 2.6, dist * 8.5]} />
      <hemisphereLight args={["#f8f4ec", "#6f7f5c", 0.55]} />
      <directionalLight
        castShadow
        position={[dist * 0.6, dist * 0.9, dist * 0.45]}
        intensity={2.6}
        color="#fff3e2"
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
        shadow-camera-left={-radius * 1.6}
        shadow-camera-right={radius * 1.6}
        shadow-camera-top={Math.max(radius * 1.6, H)}
        shadow-camera-bottom={-radius * 1.6}
        shadow-camera-far={dist * 4}
      />
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.2} position={[0, 12, 0]} scale={[30, 30, 1]} rotation-x={Math.PI / 2} />
        <Lightformer intensity={1.2} color="#cfe3f2" position={[-12, 4, -6]} rotation-y={Math.PI / 2} scale={[40, 6, 1]} />
        <Lightformer intensity={0.8} color="#ffe2c2" position={[12, 3, 8]} rotation-y={-Math.PI / 2} scale={[30, 4, 1]} />
      </Environment>

      <Setting s={spec} radius={radius} orbit={dist} />
      {spec.hasPool && <Pool position={[0, 0, spanZ / 2 + (spec.podiumFloors ? 3 : 0) + 7]} length={poolLength} width={4.5} />}
      {positions.map((p, i) => (
        <group key={i} position={p}>
          {spec.kind === "townhouses" ? <Townhouses s={spec} seed={i * 3} /> : <Block s={spec} photo={photoFacades && i === 0} seed={i * 3} />}
        </group>
      ))}
      {plants.map((t, i) => (t.palm ? <Palm key={i} p={t.p} h={t.h} lean={t.lean} frond={frond} /> : <Tree key={i} p={t.p} h={t.h} />))}

      <ContactShadows position={[0, 0.04, 0]} opacity={0.4} scale={radius * 3} blur={2.4} far={H + 5} frames={1} resolution={1024} />
      <OrbitControls
        makeDefault
        enableDamping
        autoRotate={autoRotate}
        autoRotateSpeed={0.35}
        onStart={() => setAutoRotate(false)}
        maxPolarAngle={Math.PI / 2.08}
        minDistance={Math.max(8, H * 0.25)}
        maxDistance={dist * 2.6}
        target={[0, H * 0.42, 0]}
      />
    </Canvas>
  );
}
