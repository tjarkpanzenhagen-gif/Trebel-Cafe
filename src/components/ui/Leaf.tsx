export const LEAF_COLORS = ["#D9B888", "#A94B22", "#6E2A34"];

const SHAPES = [
  "M16 2C9 8 4 14 4 20a12 12 0 0 0 24 0c0-6-5-12-12-18Z",
  "M16 1C11 6 3 10 3 18c0 8 6 13 13 13s13-5 13-13C29 10 21 6 16 1Z",
  "M16 3c-2 5-11 8-11 16 0 7 5 12 11 12s11-5 11-12C27 11 18 8 16 3Z",
];

export function Leaf({ color, rotate = 0, shape = 0 }: { color: string; rotate?: number; shape?: number }) {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%" style={{ transform: `rotate(${rotate}deg)` }}>
      <path d={SHAPES[shape % SHAPES.length]} fill={color} />
      <path d="M16 4V29" stroke="#2A1710" strokeOpacity="0.25" strokeWidth="1" />
    </svg>
  );
}

function rnd(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export type DriftLeaf = {
  left: string;
  size: number;
  delay: string;
  duration: string;
  color: string;
  rotate: number;
  shape: number;
  driftX0: string;
  driftXm: string;
  driftX1: string;
  driftRot: string;
};

// Randomized per render (server-rendered only, no hydration mismatch) so the
// field never looks like a hand-placed, evenly-spaced pattern. The path has a
// mid-fall "gust" offset so leaves swerve sideways instead of falling straight
// down like snow — that swerve is what reads as wind, not decoration.
export function randomLeafField(count: number): DriftLeaf[] {
  return Array.from({ length: count }, () => ({
    left: `${rnd(1, 97).toFixed(1)}%`,
    size: Math.round(rnd(15, 42)),
    delay: `-${rnd(0, 32).toFixed(1)}s`,
    duration: `${rnd(13, 30).toFixed(1)}s`,
    color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
    rotate: Math.round(rnd(-35, 35)),
    shape: Math.floor(Math.random() * SHAPES.length),
    driftX0: `${rnd(-5, 5).toFixed(1)}%`,
    driftXm: `${rnd(-30, -8).toFixed(1)}%`,
    driftX1: `${rnd(-14, 10).toFixed(1)}%`,
    driftRot: `${Math.round(rnd(100, 260))}deg`,
  }));
}

export type ScatterLeaf = {
  left: string;
  top: string;
  size: number;
  color: string;
  rotate: number;
  shape: number;
  opacity: number;
};

// Loosely scattered, non-animated leaves for static ornaments (e.g. above the footer).
// Kept fully inside a 0–100% band (with margin for size) so a parent with
// overflow-hidden never clips them into flat-topped shapes.
export function randomLeafScatter(count: number): ScatterLeaf[] {
  return Array.from({ length: count }, () => ({
    left: `${rnd(3, 94).toFixed(1)}%`,
    top: `${rnd(8, 52).toFixed(1)}%`,
    size: Math.round(rnd(14, 26)),
    color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
    rotate: Math.round(rnd(-40, 40)),
    shape: Math.floor(Math.random() * SHAPES.length),
    opacity: Number(rnd(0.55, 0.9).toFixed(2)),
  }));
}
