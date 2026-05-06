export const RINGS = [60, 120, 175, 230] as const;
export const SLICES = 8;

const generateCoordinates = () => {
  const coords: Record<string, [number, number]> = {};
  // Midpoints of rings: [0-RINGS[0], RINGS[0]-RINGS[1], ...]
  const cellRadii = [
    RINGS[0] / 2,
    (RINGS[0] + RINGS[1]) / 2,
    (RINGS[1] + RINGS[2]) / 2,
    (RINGS[2] + RINGS[3]) / 2,
  ];
  
  for (let r = 1; r <= 4; r++) {
    const radius = cellRadii[r - 1];
    for (let s = 0; s < SLICES; s++) {
      // The slice lines are at 90, 45, 0, -45, -90, -135, -180, -225 degrees.
      // We want the cell center to be offset by 22.5 degrees (PI/8) from these lines.
      const angle = (Math.PI / 2) - (Math.PI / 8) - (s * (Math.PI / 4));
      const x = Math.round(radius * Math.cos(angle) * 100) / 100;
      const y = Math.round(radius * Math.sin(angle) * 100) / 100;
      coords[`r${r}s${s}`] = [x, y];
    }
  }
  return coords;
};

export const COORDINATES = generateCoordinates();

export type LocationKey = keyof typeof COORDINATES;

const generateWinConditions = () => {
  const wins: Record<string, string[]> = {};

  // Radial (Vertical)
  for (let s = 0; s < SLICES; s++) {
    wins[`radial-s${s}`] = [`r1s${s}`, `r2s${s}`, `r3s${s}`, `r4s${s}`];
  }

  // Circular (Horizontal)
  for (let r = 1; r <= 4; r++) {
    for (let s = 0; s < SLICES; s++) {
      wins[`circular-r${r}-s${s}`] = [
        `r${r}s${s}`,
        `r${r}s${(s + 1) % SLICES}`,
        `r${r}s${(s + 2) % SLICES}`,
        `r${r}s${(s + 3) % SLICES}`,
      ];
    }
  }

  // Spirals
  for (let s = 0; s < SLICES; s++) {
    // Clockwise Spiral
    wins[`spiral-cw-s${s}`] = [
      `r1s${s}`,
      `r2s${(s + 1) % SLICES}`,
      `r3s${(s + 2) % SLICES}`,
      `r4s${(s + 3) % SLICES}`,
    ];
    // Counter-Clockwise Spiral
    wins[`spiral-ccw-s${s}`] = [
      `r1s${s}`,
      `r2s${(s - 1 + SLICES) % SLICES}`,
      `r3s${(s - 2 + SLICES) % SLICES}`,
      `r4s${(s - 3 + SLICES) % SLICES}`,
    ];
  }

  return wins;
};

export const WIN_CONDITIONS = generateWinConditions();

export type Player = 'x' | 'o';
export type BoardState = Partial<Record<LocationKey, Player>>;
export type Difficulty = 'Beginner' | 'Pro' | 'Impossible';
