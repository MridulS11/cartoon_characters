import React, { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { SQUAD_CHARACTERS } from '../data/squadData';
import { Character3DMesh } from './Character3DMesh';

interface HeroSceneProps {
  scrollProgress: number;
}

const MinimalStageRig: React.FC<{
  children: React.ReactNode;
  scrollProgress: number;
  dragAngles: { yaw: number; pitch: number };
}> = ({ children, scrollProgress, dragAngles }) => {
  const stageRef = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  const stageCenterX = 0.11;
  const targetLookAt = useRef(new THREE.Vector3(stageCenterX, 1.28, -0.1));

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const aspect = size.width / Math.max(size.height, 1);

    // Exact frustum fit so +15% Dragon (-3.12m) to +15% Golem (+3.34m) & 2.84m height fit cleanly
    const neededHalfWidth = 3.62;
    const vFovRad = THREE.MathUtils.degToRad(26);
    const hHalfTan = Math.tan(vFovRad / 2) * aspect;
    const minHorizontalFitZ = neededHalfWidth / Math.max(hHalfTan, 0.24);
    const baseZ = Math.max(6.85, minHorizontalFitZ);

    // Subtle, calm 3D camera parallax on pointer move + smooth 3D dolly on scroll
    const pointerX = state.pointer.x * 0.36;
    const pointerY = state.pointer.y * 0.14;

    const desiredX = stageCenterX + pointerX;
    const desiredY = 1.3 + pointerY + scrollProgress * 0.35;
    const desiredZ = baseZ - scrollProgress * 0.7;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, desiredX, dt * 4);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, desiredY, dt * 4);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, desiredZ, dt * 4);

    targetLookAt.current.lerp(
      new THREE.Vector3(stageCenterX, 1.28 - scrollProgress * 0.25, -0.1),
      dt * 5
    );
    camera.lookAt(targetLookAt.current);

    if (stageRef.current) {
      stageRef.current.rotation.y = THREE.MathUtils.lerp(
        stageRef.current.rotation.y,
        dragAngles.yaw + state.pointer.x * 0.045,
        dt * 5
      );
      stageRef.current.rotation.x = THREE.MathUtils.lerp(
        stageRef.current.rotation.x,
        dragAngles.pitch - state.pointer.y * 0.02 + scrollProgress * 0.08,
        dt * 5
      );
    }
  });

  return <group ref={stageRef}>{children}</group>;
};

export const HeroScene3D: React.FC<HeroSceneProps> = ({ scrollProgress }) => {
  const isDraggingRef = useRef(false);
  const lastClientRef = useRef({ x: 0, y: 0 });
  const [dragAngles, setDragAngles] = React.useState({ yaw: 0, pitch: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    lastClientRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastClientRef.current.x;
    const dy = e.clientY - lastClientRef.current.y;
    lastClientRef.current = { x: e.clientX, y: e.clientY };
    setDragAngles((prev) => ({
      yaw: THREE.MathUtils.clamp(prev.yaw + dx * 0.004, -0.34, 0.34),
      pitch: THREE.MathUtils.clamp(prev.pitch + dy * 0.002, -0.1, 0.12),
    }));
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    setDragAngles({ yaw: 0, pitch: 0 });
  };

  return (
    <div
      className="hero-canvas-shell"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0.11, 1.3, 6.85], fov: 26, near: 0.1, far: 30 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.04,
        }}
      >
        {/* Clean Bright Pure-White Pixar Studio Lighting */}
        <ambientLight intensity={1.2} color="#ffffff" />
        <hemisphereLight args={['#ffffff', '#f1f5f9', 0.75]} />
        <directionalLight
          position={[2.6, 5.5, 5.2]}
          intensity={1.3}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={20}
          shadow-camera-left={-5.0}
          shadow-camera-right={5.0}
          shadow-camera-top={4.2}
          shadow-camera-bottom={-0.6}
          shadow-bias={-0.0004}
        />

        <Suspense fallback={null}>
          <MinimalStageRig scrollProgress={scrollProgress} dragAngles={dragAngles}>
            {/* Invisible Pure-White Ground Plane Catching Subtle Studio Floor Contact Shadows */}
            <ContactShadows
              position={[0.11, 0.001, -0.1]}
              opacity={0.34}
              scale={9.6}
              blur={2.4}
              far={3.0}
              resolution={512}
              color="#334155"
            />

            {SQUAD_CHARACTERS.map((char) => (
              <Character3DMesh key={char.id} character={char} />
            ))}
          </MinimalStageRig>
        </Suspense>
      </Canvas>
    </div>
  );
};
