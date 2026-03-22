import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function MoonCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Star particles ──
    const starCount = 200;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 20;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3),
    );
    const starMat = new THREE.PointsMaterial({
      color: 0xe8f4ff,
      size: 0.04,
      transparent: true,
      opacity: 0.8,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ── Firefly particles ──
    const fireflyCount = 40;
    const fireflyData: {
      x: number;
      y: number;
      z: number;
      phase: number;
      speed: number;
      radius: number;
    }[] = [];
    for (let i = 0; i < fireflyCount; i++) {
      fireflyData.push({
        x: (Math.random() - 0.5) * 16,
        y: (Math.random() - 0.5) * 10,
        z: (Math.random() - 0.5) * 2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.7,
        radius: 0.3 + Math.random() * 1.2,
      });
    }
    const fireflyPositions = new Float32Array(fireflyCount * 3);
    const fireflyGeo = new THREE.BufferGeometry();
    fireflyGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(fireflyPositions, 3),
    );
    const fireflyColors = new Float32Array(fireflyCount * 3);
    for (let i = 0; i < fireflyCount; i++) {
      const t = Math.random();
      fireflyColors[i * 3] = 0.9 + t * 0.1; // R — golden
      fireflyColors[i * 3 + 1] = 0.75 + t * 0.15; // G
      fireflyColors[i * 3 + 2] = 0.1 + t * 0.2; // B
    }
    fireflyGeo.setAttribute(
      "color",
      new THREE.BufferAttribute(fireflyColors, 3),
    );
    const fireflyMat = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });
    const fireflies = new THREE.Points(fireflyGeo, fireflyMat);
    scene.add(fireflies);

    // ── Light rays from moon center ──
    const rayGroup = new THREE.Group();
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const rayGeo = new THREE.PlaneGeometry(0.04, 4);
      const rayMat = new THREE.MeshBasicMaterial({
        color: 0xdcebff,
        transparent: true,
        opacity: 0.06,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const ray = new THREE.Mesh(rayGeo, rayMat);
      ray.position.set(Math.cos(angle) * 1.8, Math.sin(angle) * 1.8 + 2.5, -1);
      ray.rotation.z = angle + Math.PI / 2;
      rayGroup.add(ray);
    }
    scene.add(rayGroup);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Drift stars gently
      stars.rotation.y = t * 0.004;
      stars.rotation.x = Math.sin(t * 0.003) * 0.02;

      // Update firefly positions
      const positions = fireflyGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < fireflyCount; i++) {
        const ff = fireflyData[i];
        positions.setXYZ(
          i,
          ff.x + Math.sin(t * ff.speed + ff.phase) * ff.radius,
          ff.y + Math.cos(t * ff.speed * 0.7 + ff.phase) * ff.radius * 0.6,
          ff.z,
        );
      }
      positions.needsUpdate = true;

      // Pulse light rays
      rayGroup.children.forEach((child, idx) => {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.03 + 0.07 * Math.abs(Math.sin(t * 0.5 + idx * 0.4));
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}
