import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const PETAL_COUNT = 90;
const RAY_COUNT = 8;

function Petals({
  mouse,
}: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const data = useRef<
    {
      pos: THREE.Vector3;
      vel: number;
      sway: number;
      swayPhase: number;
      rot: number;
      rotVel: number;
    }[]
  >([]);
  const dummy = useRef(new THREE.Object3D());

  useEffect(() => {
    data.current = Array.from({ length: PETAL_COUNT }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 22,
        Math.random() * 20 - 2,
        (Math.random() - 0.5) * 6,
      ),
      vel: 0.005 + Math.random() * 0.012,
      sway: 0.3 + Math.random() * 0.5,
      swayPhase: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI * 2,
      rotVel: (Math.random() - 0.5) * 0.02,
    }));
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const mx = mouse.current.x * 0.8;
    const my = mouse.current.y * 0.3;
    data.current.forEach((p, i) => {
      p.pos.y -= p.vel;
      p.pos.x += Math.sin(t * 0.4 + p.swayPhase) * p.sway * 0.01 + mx * 0.004;
      p.pos.y += my * 0.002;
      p.rot += p.rotVel;
      if (p.pos.y < -10) {
        p.pos.y = 12 + Math.random() * 4;
        p.pos.x = (Math.random() - 0.5) * 22;
      }
      dummy.current.position.copy(p.pos);
      dummy.current.rotation.z = p.rot;
      dummy.current.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.current.matrix);
    });
    mesh.current!.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, PETAL_COUNT]}>
      <planeGeometry args={[0.07, 0.1]} />
      <meshBasicMaterial
        color="#f48fb1"
        transparent
        opacity={0.65}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}

function GoldPetals({
  mouse,
}: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const data = useRef<
    {
      pos: THREE.Vector3;
      vel: number;
      sway: number;
      swayPhase: number;
      rot: number;
      rotVel: number;
    }[]
  >([]);
  const dummy = useRef(new THREE.Object3D());

  useEffect(() => {
    data.current = Array.from({ length: 80 }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        Math.random() * 18,
        (Math.random() - 0.5) * 4,
      ),
      vel: 0.004 + Math.random() * 0.008,
      sway: 0.4 + Math.random() * 0.6,
      swayPhase: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI * 2,
      rotVel: (Math.random() - 0.5) * 0.015,
    }));
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const mx = mouse.current.x * 0.6;
    data.current.forEach((p, i) => {
      p.pos.y -= p.vel;
      p.pos.x += Math.cos(t * 0.3 + p.swayPhase) * p.sway * 0.012 + mx * 0.003;
      p.rot += p.rotVel;
      if (p.pos.y < -10) {
        p.pos.y = 12 + Math.random() * 6;
        p.pos.x = (Math.random() - 0.5) * 20;
      }
      dummy.current.position.copy(p.pos);
      dummy.current.rotation.z = p.rot;
      dummy.current.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.current.matrix);
    });
    mesh.current!.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, 80]}>
      <planeGeometry args={[0.05, 0.07]} />
      <meshBasicMaterial
        color="#D4AF37"
        transparent
        opacity={0.5}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}

function LightRays() {
  const raysRef = useRef<THREE.Group>(null);
  const angles = Array.from(
    { length: RAY_COUNT },
    (_, i) => (i / RAY_COUNT) * Math.PI * 0.6 - Math.PI * 0.3,
  );

  useFrame(({ clock }) => {
    if (!raysRef.current) return;
    const t = clock.getElapsedTime();
    raysRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.04 + Math.sin(t * 0.5 + i * 0.8) * 0.03;
    });
  });

  return (
    <group ref={raysRef}>
      {angles.map((angle) => (
        <mesh
          key={angle.toFixed(4)}
          position={[Math.sin(angle) * 0.5, 4, -2]}
          rotation={[0, 0, angle]}
        >
          <coneGeometry args={[0.12, 14, 6]} />
          <meshBasicMaterial color="#ffe082" transparent opacity={0.06} />
        </mesh>
      ))}
    </group>
  );
}

function WaterPlane() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const geo = mesh.geometry as THREE.PlaneGeometry;
    const pos = geo.attributes.position;
    const t = clock.getElapsedTime();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(
        i,
        Math.sin(x * 1.5 + t * 1.2) * 0.08 + Math.sin(y * 1.2 + t * 0.9) * 0.06,
      );
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.5, 0]}>
      <planeGeometry args={[30, 10, 30, 15]} />
      <meshStandardMaterial
        color="#1a3a5c"
        metalness={0.9}
        roughness={0.1}
        transparent
        opacity={0.35}
      />
    </mesh>
  );
}

function SceneContent({
  mouse,
}: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.x += (mouse.current.x * 0.3 - camera.position.x) * 0.04;
    camera.position.y += (-mouse.current.y * 0.15 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[0, 8, 4]} intensity={1.2} color="#ffe082" />
      <pointLight position={[0, 5, 2]} intensity={0.8} color="#f48fb1" />
      <Petals mouse={mouse} />
      <GoldPetals mouse={mouse} />
      <LightRays />
      <WaterPlane />
    </>
  );
}

export default function PetalScene({
  mouse,
}: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 60 }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      gl={{ antialias: false, alpha: true }}
    >
      <SceneContent mouse={mouse} />
    </Canvas>
  );
}
