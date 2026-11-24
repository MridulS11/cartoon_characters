import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import type { SquadCharacterConfig, RigidArmConfig } from '../data/squadData';

interface Character3DMeshProps {
  character: SquadCharacterConfig;
}

/**
 * Generates a soft oval contact-shadow canvas texture placed directly under
 * Togepi's round eggshell so Togepi visually nests into Bitmoji's hair with real weight.
 */
function createHeadShadowTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 6, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(28, 18, 10, 0.52)');
  grad.addColorStop(0.55, 'rgba(35, 22, 12, 0.24)');
  grad.addColorStop(1, 'rgba(35, 22, 12, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Rigid articulated 3D arm sub-mesh (zero UV warping / zero rubber waviness!).
 * Rotates purely as a rigid body around Pikachu's exact shoulder pivot slightly behind the torso.
 */
const RigidWavingArm3D: React.FC<{
  arm: RigidArmConfig;
  meshWidthM: number;
  meshHeightM: number;
  meshCenterY: number;
}> = ({ arm, meshWidthM, meshHeightM, meshCenterY }) => {
  const pivotGroupRef = useRef<THREE.Group>(null);
  const [colorTex, depthTex, normalTex] = useLoader(THREE.TextureLoader, [
    arm.textureUrl,
    arm.depthUrl,
    arm.normalUrl,
  ]);

  useMemo(() => {
    colorTex.colorSpace = THREE.SRGBColorSpace;
    colorTex.anisotropy = 8;
    depthTex.colorSpace = THREE.NoColorSpace;
    normalTex.colorSpace = THREE.NoColorSpace;
  }, [colorTex, depthTex, normalTex]);

  // Exact anatomical shoulder pivot in character-local meters
  const pivotLocalX = (arm.pivotU - 0.5) * meshWidthM;
  const pivotLocalY = meshCenterY + (arm.pivotV - 0.5) * meshHeightM;

  useFrame((state) => {
    if (!pivotGroupRef.current) return;
    const t = state.clock.elapsedTime;
    // Smooth eased sinusoidal rigid wave strictly inside [minRad, maxRad]
    const wave01 = 0.5 + 0.5 * Math.sin(t * arm.speed);
    const angleZ = THREE.MathUtils.lerp(arm.minRad, arm.maxRad, wave01);
    pivotGroupRef.current.rotation.z = angleZ;
    // Subtle natural 3D depth arc as the paw waves forward/back
    pivotGroupRef.current.rotation.y = Math.sin(t * arm.speed) * 0.14;
  });

  return (
    <group ref={pivotGroupRef} position={[pivotLocalX, pivotLocalY, -0.008]}>
      {/* Offset mesh back by (-pivotLocalX, -(pivotLocalY - meshCenterY)) so it aligns 1:1 at 0 deg */}
      <mesh position={[-pivotLocalX, meshCenterY - pivotLocalY, 0]} castShadow>
        <planeGeometry args={[meshWidthM, meshHeightM, 24, 32]} />
        <meshStandardMaterial
          map={colorTex}
          normalMap={normalTex}
          normalScale={new THREE.Vector2(0.42, 0.42)}
          displacementMap={depthTex}
          displacementScale={0.022}
          displacementBias={-0.004}
          emissive="#ffffff"
          emissiveMap={colorTex}
          emissiveIntensity={0.28}
          roughness={0.46}
          metalness={0.02}
          alphaTest={0.35}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export const Character3DMesh: React.FC<Character3DMeshProps> = ({ character }) => {
  const [colorTex, depthTex, normalTex] = useLoader(THREE.TextureLoader, [
    character.textureUrl,
    character.depthUrl,
    character.normalUrl,
  ]);

  useMemo(() => {
    colorTex.colorSpace = THREE.SRGBColorSpace;
    colorTex.anisotropy = 8;
    colorTex.minFilter = THREE.LinearMipmapLinearFilter;
    colorTex.magFilter = THREE.LinearFilter;
    colorTex.needsUpdate = true;

    depthTex.colorSpace = THREE.NoColorSpace;
    depthTex.needsUpdate = true;

    normalTex.colorSpace = THREE.NoColorSpace;
    normalTex.needsUpdate = true;
  }, [colorTex, depthTex, normalTex]);

  const headShadowTex = useMemo(
    () => (character.seatedOnHead ? createHeadShadowTexture() : null),
    [character.seatedOnHead]
  );

  const shadowDepthMaterial = useMemo(
    () =>
      new THREE.MeshDepthMaterial({
        depthPacking: THREE.RGBADepthPacking,
        map: colorTex,
        alphaTest: 0.42,
      }),
    [colorTex]
  );

  const meshCenterY = character.meshHeightM * 0.5 + character.soleOffsetM;

  return (
    <group position={character.position} rotation={[0, character.rotationY, 0]}>
      {/* Primary Crisp 3D Relief Mesh — Rock-solid grounded scale, zero rubber warping */}
      <mesh
        position={[0, meshCenterY, 0]}
        customDepthMaterial={shadowDepthMaterial}
        castShadow
      >
        <planeGeometry args={[character.meshWidthM, character.meshHeightM, 44, 64]} />
        <meshStandardMaterial
          map={colorTex}
          normalMap={normalTex}
          normalScale={new THREE.Vector2(0.45, 0.45)}
          displacementMap={depthTex}
          displacementScale={Math.min(0.06, character.meshWidthM * 0.065)}
          displacementBias={-0.01}
          emissive="#ffffff"
          emissiveMap={colorTex}
          emissiveIntensity={0.28}
          roughness={0.46}
          metalness={0.02}
          alphaTest={0.35}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Subtle 3D Extruded Vinyl Depth Rim for clean side-angle parallax */}
      <mesh position={[0, meshCenterY, -0.016]}>
        <planeGeometry args={[character.meshWidthM * 0.996, character.meshHeightM * 0.996, 16, 24]} />
        <meshStandardMaterial
          map={colorTex}
          color="#e2e8f0"
          roughness={0.7}
          metalness={0.02}
          alphaTest={0.4}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rigid Articulated Waving Arm (Pikachu) */}
      {character.rigidArm && (
        <RigidWavingArm3D
          arm={character.rigidArm}
          meshWidthM={character.meshWidthM}
          meshHeightM={character.meshHeightM}
          meshCenterY={meshCenterY}
        />
      )}

      {/* Soft Hair-Contact Shadow Beneath Togepi's Eggshell So It Visually Sits On Bitmoji's Head */}
      {character.seatedOnHead && headShadowTex && (
        <mesh position={[0, 0.028, -0.018]}>
          <planeGeometry args={[0.25, 0.095]} />
          <meshBasicMaterial
            map={headShadowTex}
            transparent
            depthWrite={false}
            opacity={0.9}
          />
        </mesh>
      )}
    </group>
  );
};
