export interface RigidArmConfig {
  textureUrl: string;
  depthUrl: string;
  normalUrl: string;
  /** Shoulder joint pivot in UV space (u: 0..1 left-to-right, v: 0..1 bottom-to-top) */
  pivotU: number;
  pivotV: number;
  /** Rigid angular wave range in radians [minRad, maxRad] */
  minRad: number;
  maxRad: number;
  speed: number;
}

export interface SquadCharacterConfig {
  id: string;
  name: string;
  canonicalHeightCm: number;
  canonicalHeightLabel: string;
  /** Exact calibrated mesh width in meters (1 unit = 1 meter) */
  meshWidthM: number;
  /** Exact calibrated mesh height in meters so crown-to-sole matches official lore */
  meshHeightM: number;
  /** Bottom padding adjustment so sole pixels rest cleanly at y = 0.000m */
  soleOffsetM: number;
  /** World position [x, y, z] in meters */
  position: [number, number, number];
  /** Subtle inward facing Y angle in radians */
  rotationY: number;
  textureUrl: string;
  depthUrl: string;
  normalUrl: string;
  /** Optional rigid articulated arm (used for Pikachu's clean non-wavy wave!) */
  rigidArm?: RigidArmConfig;
  /** True when perched on Bitmoji's hair with a head-contact shadow */
  seatedOnHead?: boolean;
}

/**
 * 1 Three.js world unit = 1.000 meter.
 * Canonical lore heights (Bitmoji ~5'8"):
 * - Bitmoji: 5'8" (172.7 cm)
 * - Zenitsu: 5'4.8" (164.5 cm)
 * - Inosuke: 5'4.5" (164.0 cm, boar-head crown to sandals)
 * - Mario:   5'1" (155.0 cm)
 * - Pikachu: 1'4" (40.0 cm head crown to paws, waving by Bitmoji's foot)
 * - Togepi:  1'0" (30.0 cm, seated snugly into Bitmoji's hair)
 */
export const SQUAD_CHARACTERS: SquadCharacterConfig[] = [
  {
    id: 'mario',
    name: 'Mario',
    canonicalHeightCm: 155.0,
    canonicalHeightLabel: `5'1"`,
    meshWidthM: 1.013,
    meshHeightM: 1.589,
    soleOffsetM: -0.02,
    position: [-1.88, 0, -0.14],
    rotationY: 0.1,
    textureUrl: '/characters/mario.png',
    depthUrl: '/characters/mario_depth.png',
    normalUrl: '/characters/mario_normal.png',
  },
  {
    id: 'inosuke',
    name: 'Inosuke',
    canonicalHeightCm: 164.0,
    canonicalHeightLabel: `5'4.5"`,
    meshWidthM: 1.345,
    meshHeightM: 1.9,
    soleOffsetM: -0.02,
    position: [-0.86, 0, -0.08],
    rotationY: 0.04,
    textureUrl: '/characters/inosuke.png',
    depthUrl: '/characters/inosuke_depth.png',
    normalUrl: '/characters/inosuke_normal.png',
  },
  {
    id: 'bitmoji',
    name: 'Creator',
    canonicalHeightCm: 172.7,
    canonicalHeightLabel: `5'8"`,
    meshWidthM: 0.744,
    meshHeightM: 1.768,
    soleOffsetM: -0.021,
    position: [0.06, 0, 0.05],
    rotationY: 0.0,
    textureUrl: '/characters/bitmoji.png',
    depthUrl: '/characters/bitmoji_depth.png',
    normalUrl: '/characters/bitmoji_normal.png',
  },
  {
    id: 'togepi',
    name: 'Togepi',
    canonicalHeightCm: 30.0,
    canonicalHeightLabel: `1'0"`,
    meshWidthM: 0.325,
    meshHeightM: 0.309,
    soleOffsetM: -0.005,
    // Seated dead-center & snugly into the crown of Bitmoji's swept-up hair (accounting for Bitmoji's outstretched left-side waving arm)
    position: [0.106, 1.595, 0.085],
    rotationY: 0.0,
    textureUrl: '/characters/togepi.png',
    depthUrl: '/characters/togepi_depth.png',
    normalUrl: '/characters/togepi_normal.png',
    seatedOnHead: true,
  },
  {
    id: 'pikachu',
    name: 'Pikachu',
    canonicalHeightCm: 40.0,
    canonicalHeightLabel: `1'4"`,
    meshWidthM: 0.435,
    meshHeightM: 0.518,
    soleOffsetM: -0.007,
    // Standing right next to Bitmoji's sneaker waving cheerfully
    position: [0.41, 0, 0.2],
    rotationY: -0.05,
    textureUrl: '/characters/pikachu_body.png',
    depthUrl: '/characters/pikachu_body_depth.png',
    normalUrl: '/characters/pikachu_body_normal.png',
    rigidArm: {
      textureUrl: '/characters/pikachu_arm.png',
      depthUrl: '/characters/pikachu_arm_depth.png',
      normalUrl: '/characters/pikachu_arm_normal.png',
      pivotU: 0.214,
      pivotV: 0.406,
      // Clean rigid shoulder rotation strictly in the verified seamless range (-11.5 deg upward to +3.5 deg outward)
      minRad: -0.2,
      maxRad: 0.06,
      speed: 4.6,
    },
  },
  {
    id: 'zenitsu',
    name: 'Zenitsu',
    canonicalHeightCm: 164.5,
    canonicalHeightLabel: `5'4.8"`,
    meshWidthM: 0.839,
    meshHeightM: 1.684,
    soleOffsetM: -0.02,
    position: [1.14, 0, -0.08],
    rotationY: -0.09,
    textureUrl: '/characters/zenitsu.png',
    depthUrl: '/characters/zenitsu_depth.png',
    normalUrl: '/characters/zenitsu_normal.png',
  },
];

export interface MinimalWorkItem {
  id: string;
  index: string;
  title: string;
  category: string;
  summary: string;
  year: string;
}

export const MINIMAL_WORKS: MinimalWorkItem[] = [
  {
    id: 'spatial-ui',
    index: '01',
    title: 'Spatial Interface System',
    category: '3D Web · Design Systems',
    summary: 'Lightweight WebGL micro-interactions and tactile depth primitives built for everyday web apps.',
    year: '2026',
  },
  {
    id: 'realtime-canvas',
    index: '02',
    title: 'Realtime Studio Engine',
    category: 'Three.js · Shaders',
    summary: 'Physically scaled character staging and responsive camera choreography running smoothly at 60 FPS.',
    year: '2026',
  },
  {
    id: 'companion-os',
    index: '03',
    title: 'Playful Product Experiments',
    category: 'Creative Engineering',
    summary: 'Minimalist interfaces paired with subtle 3D storytelling, crafted to feel calm, crisp, and human.',
    year: '2025',
  },
];
