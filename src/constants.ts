const RINGS = [60, 120, 175, 230] as const;
const SLICES = 8;

const generateCoordinates = () => {
  const coords: Record<string, [number, number]> = {};
  for (let r = 1; r <= 4; r++) {
    const radius = RINGS[r - 1];
    for (let s = 0; s < SLICES; s++) {
      const angle = (Math.PI / 2) - (s * (Math.PI / 4));
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
