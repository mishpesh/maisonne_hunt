import { Component, useEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Html,
  Lightformer,
  Line,
  OrbitControls,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as ControlsType } from "three-stdlib";
import {
  bayGeometry,
  configurationCounts,
  doorColors,
  wardrobeGeometry,
  woodFinishes,
} from "../configuration";
import type { Configuration, HandleStyle } from "../configuration";
import { useStore } from "../store";
export type WardrobeView = "perspective" | "front" | "side" | "detail";
export type PreviewProps = {
  config: Configuration;
  compact?: boolean;
  resetKey?: number;
  zoom?: number;
  view?: WardrobeView;
  showDimensions?: boolean;
  selectedSection?: number | null;
  onSelectSection?: (index: number) => void;
  onCaptureReady?: (capture: (() => string) | null) => void;
};
function grainTexture(color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 512, 1024);
  let seed = 107;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < 1700; i++) {
    const x = random() * 512,
      phase = random() * 8;
    ctx.strokeStyle = `rgba(${i % 4 === 0 ? "255,252,231" : "83,54,27"},${0.008 + random() * 0.028})`;
    ctx.lineWidth = 0.3 + random() * 1.7;
    ctx.beginPath();
    for (let y = 0; y <= 1024; y += 8) {
      const offset =
        Math.sin(y * 0.009 + phase) * 3 + Math.sin(y * 0.025 + phase) * 0.6;
      if (!y) ctx.moveTo(x + offset, y);
      else ctx.lineTo(x + offset, y);
    }
    ctx.stroke();
  }
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  return map;
}
function Handle({
  style,
  width = 0.1,
}: {
  style: HandleStyle;
  width?: number;
}) {
  if (style === "none") return null;
  return style === "knob" ? (
    <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.012, 0.009, 0.025, 16]} />
      <meshStandardMaterial color="#67635a" metalness={0.8} roughness={0.26} />
    </mesh>
  ) : (
    <RoundedBox
      args={[width, 0.009, 0.022]}
      radius={0.003}
      smoothness={2}
      castShadow
    >
      <meshStandardMaterial color="#66645d" metalness={0.8} roughness={0.28} />
    </RoundedBox>
  );
}
function Door({
  x,
  y,
  z,
  width,
  height,
  right,
  open,
  map,
  color,
  handle,
}: {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  right: boolean;
  open: boolean;
  map: THREE.Texture | null;
  color: string;
  handle: HandleStyle;
}) {
  const ref = useRef<THREE.Group>(null),
    dir = right ? -1 : 1;
  useFrame((_, dt) => {
    if (ref.current)
      ref.current.rotation.y = THREE.MathUtils.damp(
        ref.current.rotation.y,
        open ? (right ? 1 : -1) * Math.PI * 0.52 : 0,
        8,
        dt,
      );
  });
  return (
    <group ref={ref} position={[x, y, z]}>
      <RoundedBox
        args={[width, height, 0.022]}
        radius={0.0015}
        smoothness={2}
        position={[(dir * width) / 2, 0, 0.011]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          key={map ? "wood" : color}
          map={map}
          color={map ? "#fff" : color}
          roughness={0.63}
        />
      </RoundedBox>
      <group
        position={[dir * (width - 0.048), -0.08, 0.037]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <Handle style={handle} width={0.12} />
      </group>
    </group>
  );
}
function Garment({
  position,
  color,
  width,
  height,
}: {
  position: [number, number, number];
  color: string;
  width: number;
  height: number;
}) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-width * 0.22, 0);
    s.lineTo(-width * 0.5, -height * 0.13);
    s.lineTo(-width * 0.42, -height * 0.28);
    s.lineTo(-width * 0.28, -height * 0.24);
    s.lineTo(-width * 0.3, -height);
    s.quadraticCurveTo(0, -height - 0.018, width * 0.3, -height);
    s.lineTo(width * 0.28, -height * 0.24);
    s.lineTo(width * 0.42, -height * 0.28);
    s.lineTo(width * 0.5, -height * 0.13);
    s.lineTo(width * 0.22, 0);
    s.quadraticCurveTo(0, -0.025, -width * 0.22, 0);
    return s;
  }, [width, height]);
  return (
    <group position={position}>
      <mesh castShadow>
        <extrudeGeometry
          args={[
            shape,
            {
              depth: 0.013,
              bevelEnabled: true,
              bevelSegments: 2,
              steps: 1,
              bevelSize: 0.003,
              bevelThickness: 0.003,
            },
          ]}
        />
        <meshStandardMaterial color={color} roughness={0.94} />
      </mesh>
      <mesh position={[0, 0.025, 0.005]}>
        <torusGeometry args={[0.016, 0.003, 6, 12, Math.PI * 1.5]} />
        <meshStandardMaterial
          color="#908879"
          metalness={0.65}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}
export function WardrobeModel({
  config,
  selectedSection = null,
  onSelectSection,
}: {
  config: Configuration;
  selectedSection?: number | null;
  onSelectSection?: (index: number) => void;
}) {
  const { w, h, d, t, base, innerH } = wardrobeGeometry(config);
  const map = useMemo(
    () => grainTexture(woodFinishes[config.wood].color),
    [config.wood],
  );
  useEffect(() => () => map.dispose(), [map]);
  const bodyMap = config.cabinetColor === "natural" ? map : null,
    bodyColor = bodyMap ? "#fff" : doorColors[config.cabinetColor].color;
  function panel(
    key: string,
    size: [number, number, number],
    position: [number, number, number],
  ) {
    return (
      <RoundedBox
        key={key}
        args={size}
        radius={0.0015}
        smoothness={2}
        position={position}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          key={config.cabinetColor}
          map={bodyMap}
          color={bodyColor}
          roughness={0.68}
        />
      </RoundedBox>
    );
  }
  return (
    <group position={[0, -h / 2, 0]}>
      {panel("left", [t, h, d], [-w / 2 + t / 2, h / 2, 0])}
      {panel("right", [t, h, d], [w / 2 - t / 2, h / 2, 0])}
      {panel("top", [w - 2 * t, t, d], [0, h - t / 2, 0])}
      {panel("bottom", [w - 2 * t, t, d], [0, base + t / 2, 0])}
      {panel("plinth", [w - 2 * t, base, 0.025], [0, base / 2, d / 2 - 0.045])}
      {config.backPanel &&
        panel(
          "back",
          [w - 2 * t, innerH, 0.012],
          [0, base + t + innerH / 2, -d / 2 + 0.006],
        )}
      {Array.from({ length: config.sections }, (_, i) => {
        const b = bayGeometry(config, i);
        return (
          <group key={i}>
            {i < config.sections - 1 &&
              panel(
                `divider${i}`,
                [t, innerH, d - 0.012],
                [
                  b.centerX + b.sectionW / 2 + t / 2,
                  base + t + innerH / 2,
                  0.006,
                ],
              )}
            {b.shelves.map((y, j) =>
              panel(
                `shelf${i}-${j}`,
                [b.sectionW, t, d - 0.028],
                [b.centerX, y, 0.014],
              ),
            )}
            {Array.from({ length: b.bay.drawers }, (_, j) => {
              const y = base + t + (j + 0.5) * b.drawerHeight;
              return (
                <group key={`drawer${j}`}>
                  {panel(
                    `front${i}-${j}`,
                    [b.sectionW - 0.008, b.drawerHeight - 0.006, 0.022],
                    [b.centerX, y, d / 2 - 0.011],
                  )}
                  <group position={[b.centerX, y, d / 2 + 0.018]}>
                    <Handle
                      style={config.handles}
                      width={Math.min(0.15, b.sectionW * 0.34)}
                    />
                  </group>
                </group>
              );
            })}
            {b.bay.mode === "hanging" && (
              <group>
                <mesh
                  position={[b.centerX, b.railY, 0.015]}
                  rotation={[0, 0, Math.PI / 2]}
                  castShadow
                >
                  <cylinderGeometry
                    args={[0.012, 0.012, b.sectionW - 0.025, 20]}
                  />
                  <meshStandardMaterial
                    color="#a9a7a0"
                    metalness={0.9}
                    roughness={0.26}
                  />
                </mesh>
                {["#d5cec1", "#a5af9e", "#e7e2d9"].map((color, j) => (
                  <Garment
                    key={j}
                    color={color}
                    width={Math.min(0.3, b.sectionW * 0.5)}
                    height={Math.min(0.68, b.railY - base - t - 0.16)}
                    position={[
                      b.centerX + (j - 1) * b.sectionW * 0.22,
                      b.railY - 0.045,
                      0.04 + j * 0.045,
                    ]}
                  />
                ))}
              </group>
            )}
            {config.doors && (
              <Door
                x={
                  i % 2
                    ? b.centerX + b.sectionW / 2
                    : b.centerX - b.sectionW / 2
                }
                y={base + t + innerH / 2}
                z={d / 2 + 0.014}
                width={b.sectionW - 0.004}
                height={innerH - 0.005}
                right={i % 2 === 1}
                open={config.open}
                map={config.doorColor === "natural" ? map : null}
                color={doorColors[config.doorColor].color}
                handle={config.handles}
              />
            )}
            {onSelectSection && (
              <mesh
                position={[b.centerX, base + t + innerH / 2, d / 2 + 0.05]}
                onClick={(e) => {
                  if (e.delta < 5) {
                    e.stopPropagation();
                    onSelectSection(i);
                  }
                }}
                onPointerOver={() => {
                  document.body.style.cursor = "pointer";
                }}
                onPointerOut={() => {
                  document.body.style.cursor = "";
                }}
              >
                <planeGeometry args={[b.sectionW, innerH]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
              </mesh>
            )}
            {selectedSection === i && (
              <Line
                name="selection"
                points={[
                  [b.centerX - b.sectionW / 2, base + t, d / 2 + 0.055],
                  [b.centerX - b.sectionW / 2, h - t, d / 2 + 0.055],
                  [b.centerX + b.sectionW / 2, h - t, d / 2 + 0.055],
                  [b.centerX + b.sectionW / 2, base + t, d / 2 + 0.055],
                  [b.centerX - b.sectionW / 2, base + t, d / 2 + 0.055],
                ]}
                color="#386d96"
                lineWidth={1.7}
              />
            )}
            {onSelectSection && selectedSection !== null && (
              <Html
                center
                position={[b.centerX, base + innerH * 0.52, d / 2 + 0.04]}
              >
                <button
                  className={`bay-hotspot ${selectedSection === i ? "active" : ""}`}
                  onClick={() => onSelectSection(i)}
                  aria-label={`${i + 1}`}
                >
                  {i + 1}
                </button>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
function DimensionLabel({
  label,
  position,
  vertical = false,
}: {
  label: string;
  position: [number, number, number];
  vertical?: boolean;
}) {
  const ref = useRef<THREE.Sprite>(null);
  useFrame(({ camera, size }) => {
    if (!ref.current || !(camera instanceof THREE.PerspectiveCamera)) return;
    const distance = camera.position.distanceTo(ref.current.position);
    const height =
      (2 * distance * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 24) /
      size.height;
    ref.current.scale.set(height * 4, height, 1);
  });
  const map = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 256, 64);
    ctx.fillStyle = "#58634f";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, 128, 32);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [label]);
  useEffect(() => () => map.dispose(), [map]);
  return (
    <sprite
      ref={ref}
      position={position}
      scale={[0.39, 0.098, 1]}
      renderOrder={10}
    >
      <spriteMaterial
        map={map}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
        rotation={vertical ? Math.PI / 2 : 0}
      />
    </sprite>
  );
}
function Measurements({ config }: { config: Configuration }) {
  const { w, h, d } = wardrobeGeometry(config),
    bottom = h / 2 + 0.16,
    front = d / 2 + 0.13;
  return (
    <group name="measurements">
      <Line
        points={[
          [-w / 2, bottom, front],
          [w / 2, bottom, front],
        ]}
        color="#a9aaa2"
        lineWidth={1}
      />
      <Line
        points={[
          [-w / 2, bottom - 0.025, front],
          [-w / 2, bottom + 0.025, front],
        ]}
        color="#92998c"
      />
      <Line
        points={[
          [w / 2, bottom - 0.025, front],
          [w / 2, bottom + 0.025, front],
        ]}
        color="#92998c"
      />
      <DimensionLabel
        label={`${config.width} cm`}
        position={[0, bottom, front]}
      />
      <Line
        points={[
          [-w / 2 - 0.2, -h / 2, front],
          [-w / 2 - 0.2, h / 2, front],
        ]}
        color="#a9aaa2"
      />
      <DimensionLabel
        label={`${config.height} cm`}
        position={[-w / 2 - 0.2, 0, front]}
        vertical
      />
      <Line
        points={[
          [w / 2 + 0.15, -h / 2, -d / 2],
          [w / 2 + 0.15, -h / 2, d / 2],
        ]}
        color="#a9aaa2"
      />
      <DimensionLabel
        label={`${config.depth} cm`}
        position={[w / 2 + 0.22, -h / 2, 0]}
      />
    </group>
  );
}
function CameraRig({
  config,
  resetKey = 0,
  zoom = 0,
  view = "perspective",
  compact = false,
}: PreviewProps) {
  const { camera, size } = useThree(),
    controls = useRef<ControlsType>(null);
  const { w, h, d } = wardrobeGeometry(config);
  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1),
      fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 34,
      fit = Math.max(
        h / (2 * Math.tan(THREE.MathUtils.degToRad(fov / 2))),
        w / (2 * Math.tan(THREE.MathUtils.degToRad(fov / 2))) / aspect,
      );
    const dist = fit * (compact ? 1.12 : 1.55) + d * 0.4;
    const target = new THREE.Vector3(0, -0.02, 0);
    if (view === "front") camera.position.set(0, 0.02, dist);
    else if (view === "side")
      camera.position.set(dist * 0.88, dist * 0.13, dist * 0.38);
    else if (view === "detail") {
      camera.position.set(dist * 0.18, dist * 0.04, dist * 0.47);
      target.set(0, -h * 0.09, 0);
    } else camera.position.set(dist * 0.36, dist * 0.17, dist * 0.92);
    camera.lookAt(target);
    controls.current?.target.copy(target);
    controls.current?.update();
  }, [w, h, d, size.width, size.height, resetKey, view, compact, camera]);
  const oldZoom = useRef(zoom);
  useEffect(() => {
    if (oldZoom.current !== zoom) {
      camera.position
        .sub(controls.current?.target || new THREE.Vector3())
        .multiplyScalar(zoom > oldZoom.current ? 0.86 : 1.16)
        .add(controls.current?.target || new THREE.Vector3());
      oldZoom.current = zoom;
      controls.current?.update();
    }
  }, [zoom, camera]);
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.12}
      minDistance={1.2}
      maxDistance={12}
      minPolarAngle={0.15}
      maxPolarAngle={Math.PI * 0.495}
      enablePan={!compact}
      enableZoom={!compact}
    />
  );
}
function CaptureBridge({
  onCaptureReady,
}: Pick<PreviewProps, "onCaptureReady">) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    onCaptureReady?.(() => {
      const helpers: THREE.Object3D[] = [];
      scene.traverse((object) => {
        if (
          (object.name === "measurements" || object.name === "selection") &&
          object.visible
        ) {
          helpers.push(object);
          object.visible = false;
        }
      });
      try {
        gl.render(scene, camera);
        return gl.domElement.toDataURL("image/png");
      } finally {
        helpers.forEach((object) => {
          object.visible = true;
        });
      }
    });
    return () => onCaptureReady?.(null);
  }, [onCaptureReady, gl, scene, camera]);
  return null;
}
class RenderBoundary extends Component<
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
export default function WardrobePreview(props: PreviewProps) {
  const {
    config,
    compact = false,
    showDimensions = false,
    selectedSection,
    onSelectSection,
    onCaptureReady,
  } = props;
  const { t } = useStore();
  const { h } = wardrobeGeometry(config);
  const fallback = <div className="render-fallback">{t("renderError")}</div>;
  const stats = configurationCounts(config);
  return (
    <RenderBoundary fallback={fallback}>
      <Canvas
        frameloop={compact ? "demand" : "always"}
        shadows
        dpr={[1, 2]}
        camera={{ position: [3, 1, 5], fov: 34, near: 0.05, far: 60 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true,
        }}
        fallback={fallback}
        aria-label={`${t("configTitle")} — ${config.width} × ${config.height} × ${config.depth} cm, ${stats.shelves} ${t("shelvesTotal")}`}
      >
        <color attach="background" args={["#ffffff"]} />
        <ambientLight intensity={0.65} />
        <hemisphereLight args={["#ffffff", "#d3cfc5", 1.35]} />
        <directionalLight
          position={[-3, 5, 6]}
          intensity={2.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
          shadow-normalBias={0.015}
          shadow-bias={-0.0001}
          shadow-radius={5}
        />
        <Environment resolution={64}>
          <Lightformer
            intensity={1.1}
            position={[-4, 4, 3]}
            scale={[5, 5, 1]}
          />
          <Lightformer
            intensity={0.6}
            position={[4, 2, -2]}
            scale={[3, 5, 1]}
          />
        </Environment>
        <WardrobeModel
          config={config}
          selectedSection={selectedSection}
          onSelectSection={onSelectSection}
        />
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -h / 2 - 0.008, 0]}
          receiveShadow
        >
          <planeGeometry args={[200, 200]} />
          <shadowMaterial transparent opacity={0.055} color="#555b4c" />
        </mesh>

        {showDimensions && <Measurements config={config} />}
        <CameraRig {...props} />
        <CaptureBridge onCaptureReady={onCaptureReady} />
      </Canvas>
    </RenderBoundary>
  );
}
