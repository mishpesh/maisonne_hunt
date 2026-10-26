import { Component, useEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import { wardrobeGeometry, woodFinishes, doorColors } from "../configuration";
import type { Configuration } from "../configuration";
import { useStore } from "../store";
function woodTexture(color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 512, 1024);
  let seed = 41;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < 1500; i++) {
    const x = random() * 512;
    const opacity = 0.015 + random() * 0.065;
    ctx.strokeStyle = `rgba(${i % 3 === 0 ? "255,244,214" : "69,39,15"},${opacity})`;
    ctx.lineWidth = 0.3 + random() * 1.2;
    ctx.beginPath();
    for (let y = 0; y <= 1024; y += 12) {
      const xx =
        x +
        Math.sin(y * 0.007 + x * 0.03) * 2.2 +
        Math.sin(y * 0.021 + x) * 0.5;
      if (y === 0) ctx.moveTo(xx, y);
      else ctx.lineTo(xx, y);
    }
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  return texture;
}
function Door({
  x,
  y,
  z,
  width,
  height,
  open,
  right,
  texture,
  color,
}: {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  open: boolean;
  right: boolean;
  texture: THREE.Texture | null;
  color: string;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current)
      ref.current.rotation.y = THREE.MathUtils.damp(
        ref.current.rotation.y,
        open ? (right ? 1 : -1) * Math.PI * 0.56 : 0,
        7,
        dt,
      );
  });
  const dir = right ? -1 : 1;
  return (
    <group ref={ref} position={[x, y, z]}>
      <mesh castShadow receiveShadow position={[(dir * width) / 2, 0, 0.012]}>
        <boxGeometry args={[width, height, 0.022]} />
        <meshStandardMaterial
          key={texture ? "wood" : color}
          color={texture ? "#fff" : color}
          map={texture}
          roughness={0.65}
        />
      </mesh>
      <mesh castShadow position={[dir * (width - 0.045), 0, 0.039]}>
        <boxGeometry args={[0.012, 0.14, 0.025]} />
        <meshStandardMaterial
          color="#403b31"
          metalness={0.75}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}
export function WardrobeModel({ config }: { config: Configuration }) {
  const { w, h, d, t, base, sectionW, innerH } = wardrobeGeometry(config);
  const texture = useMemo(
    () => woodTexture(woodFinishes[config.wood].color),
    [config.wood],
  );
  useEffect(() => () => texture.dispose(), [texture]);
  const panel = (
    key: string,
    size: [number, number, number],
    position: [number, number, number],
  ) => (
    <mesh key={key} castShadow receiveShadow position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        key={config.cabinetColor}
        map={config.cabinetColor === "natural" ? texture : null}
        color={
          config.cabinetColor === "natural"
            ? "#fff"
            : doorColors[config.cabinetColor].color
        }
        roughness={0.68}
      />
    </mesh>
  );
  return (
    <group position={[0, -h / 2, 0]}>
      {panel("left", [t, h, d], [-w / 2 + t / 2, h / 2, 0])}
      {panel("right", [t, h, d], [w / 2 - t / 2, h / 2, 0])}
      {panel("top", [w - 2 * t, t, d], [0, h - t / 2, 0])}
      {panel("bottom", [w - 2 * t, t, d], [0, base + t / 2, 0])}
      {panel(
        "back",
        [w - 2 * t, h - base - 2 * t, 0.012],
        [0, base + t + innerH / 2, -d / 2 + 0.006],
      )}
      {panel("plinth", [w - 2 * t, base, 0.018], [0, base / 2, d / 2 - 0.055])}
      {Array.from({ length: config.sections - 1 }, (_, i) =>
        panel(
          `divider${i}`,
          [t, innerH, d - 0.012],
          [
            -w / 2 + t + (i + 1) * sectionW + i * t + t / 2,
            base + t + innerH / 2,
            0.006,
          ],
        ),
      )}
      {Array.from({ length: config.sections }, (_, i) => {
        const centerX = -w / 2 + t + sectionW / 2 + i * (sectionW + t);
        return (
          <group key={i}>
            {Array.from({ length: config.shelves }, (_, j) =>
              panel(
                `shelf${i}-${j}`,
                [sectionW, t, d - 0.025],
                [
                  centerX,
                  base + t + ((j + 1) * innerH) / (config.shelves + 1),
                  0.0125,
                ],
              ),
            )}
            {config.doors && (
              <Door
                x={
                  i % 2 === 1 ? centerX + sectionW / 2 : centerX - sectionW / 2
                }
                y={base + t + innerH / 2}
                z={d / 2 + 0.008}
                width={sectionW - 0.006}
                height={innerH - 0.006}
                open={config.open}
                right={i % 2 === 1}
                texture={config.doorColor === "natural" ? texture : null}
                color={doorColors[config.doorColor].color}
              />
            )}
          </group>
        );
      })}
    </group>
  );
}
function CameraRig({
  config,
  resetKey,
  zoom,
  compact,
}: {
  config: Configuration;
  resetKey: number;
  zoom: number;
  compact: boolean;
}) {
  const { camera, size } = useThree();
  const controls = useRef<OrbitControlsType>(null);
  const { w, h, d } = wardrobeGeometry(config);
  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 36;
    const fitHeight = h / (2 * Math.tan(THREE.MathUtils.degToRad(fov / 2)));
    const fitWidth =
      w / (2 * Math.tan(THREE.MathUtils.degToRad(fov / 2))) / aspect;
    const dist = Math.max(fitHeight, fitWidth) * 1.28 + d;
    camera.position.set(dist * 0.47, dist * 0.2, dist * 0.88);
    camera.lookAt(0, 0, 0);
    if (controls.current) {
      controls.current.target.set(0, 0, 0);
      controls.current.update();
    }
  }, [w, h, d, resetKey, camera, size.width, size.height, compact]);
  const lastZoom = useRef(zoom);
  useEffect(() => {
    if (lastZoom.current !== zoom) {
      camera.position.multiplyScalar(zoom > lastZoom.current ? 0.85 : 1.17);
      lastZoom.current = zoom;
      controls.current?.update();
    }
  }, [zoom, camera]);
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={1.5}
      maxDistance={10}
      minPolarAngle={0.15}
      maxPolarAngle={Math.PI * 0.49}
      enablePan={!compact}
      enableZoom={!compact}
      target={[0, 0, 0]}
    />
  );
}
class WebGLBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
export default function WardrobePreview({
  config,
  compact = false,
  resetKey = 0,
  zoom = 0,
}: {
  config: Configuration;
  compact?: boolean;
  resetKey?: number;
  zoom?: number;
}) {
  const { t } = useStore();
  const { h } = wardrobeGeometry(config);
  const fallback = <div className="render-fallback">{t("renderError")}</div>;
  return (
    <WebGLBoundary fallback={fallback}>
      <Canvas
        frameloop={compact ? "demand" : "always"}
        shadows
        dpr={[1, 1.8]}
        camera={{ position: [3, 1, 5], fov: 36, near: 0.05, far: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        fallback={fallback}
        aria-label={t("configTitle")}
      >
        <ambientLight intensity={1.25} />
        <hemisphereLight args={["#fffaf0", "#b3a18c", 1]} />
        <directionalLight
          position={[4, 7, 5]}
          intensity={3.3}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
          shadow-bias={-0.0003}
        />
        <directionalLight position={[-4, 2, -2]} intensity={1.4} />
        <WardrobeModel config={config} />
        <mesh
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -h / 2 - 0.008, 0]}
        >
          <planeGeometry args={[200, 200]} />
          <shadowMaterial transparent opacity={0.12} />
        </mesh>
        <ContactShadows
          position={[0, -h / 2 - 0.005, 0]}
          opacity={0.3}
          scale={12}
          blur={2.5}
          far={3}
          resolution={512}
        />
        <CameraRig
          config={config}
          resetKey={resetKey}
          zoom={zoom}
          compact={compact}
        />
      </Canvas>
    </WebGLBoundary>
  );
}
