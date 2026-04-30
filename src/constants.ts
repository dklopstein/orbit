export const COORDINATES = {
  tm1: [0, 60],
  tm2: [0, 120],
  tm3: [0, 170],
  tm4: [0, 220],
  tl1: [-60, 30],
  tl2: [-105, 60],
  tl3: [-150, 85],
  tl4: [-195, 110],
  tr1: [60, 30],
  tr2: [105, 60],
  tr3: [150, 85],
  tr4: [195, 110],

  bm1: [0, -60],
  bm2: [0, -120],
  bm3: [0, -170],
  bm4: [0, -220],
  bl1: [-60, -30],
  bl2: [-105, -60],
  bl3: [-150, -85],
  bl4: [-195, -110],
  br1: [60, -30],
  br2: [105, -60],
  br3: [150, -85],
  br4: [195, -110],
} as const;

export type LocationKey = keyof typeof COORDINATES;

export const WIN_CONDITIONS = {
  // vertical conditions:
  tl: ['tl1', 'tl2', 'tl3', 'tl4'],
  tm: ['tm1', 'tm2', 'tm3', 'tm4'],
  tr: ['tr1', 'tr2', 'tr3', 'tr4'],
  bl: ['bl1', 'bl2', 'bl3', 'bl4'],
  bm: ['bm1', 'bm2', 'bm3', 'bm4'],
  br: ['br1', 'br2', 'br3', 'br4'],

  // horizontal conditions:
  '1-1': ['tl1', 'tm1', 'tr1', 'br1'],
  '1-2': ['tm1', 'tr1', 'br1', 'bm1'],
  '1-3': ['tr1', 'br1', 'bm1', 'bl1'],
  '1-4': ['br1', 'bm1', 'bl1', 'tl1'],
  '1-5': ['bm1', 'bl1', 'tl1', 'tm1'],
  '1-6': ['bl1', 'tl1', 'tm1', 'tr1'],

  '2-1': ['tl2', 'tm2', 'tr2', 'br2'],
  '2-2': ['tm2', 'tr2', 'br2', 'bm2'],
  '2-3': ['tr2', 'br2', 'bm2', 'bl2'],
  '2-4': ['br2', 'bm2', 'bl2', 'tl2'],
  '2-5': ['bm2', 'bl2', 'tl2', 'tm2'],
  '2-6': ['bl2', 'tl2', 'tm2', 'tr2'],

  '3-1': ['tl3', 'tm3', 'tr3', 'br3'],
  '3-2': ['tm3', 'tr3', 'br3', 'bm3'],
  '3-3': ['tr3', 'br3', 'bm3', 'bl3'],
  '3-4': ['br3', 'bm3', 'bl3', 'tl3'],
  '3-5': ['bm3', 'bl3', 'tl3', 'tm3'],
  '3-6': ['bl3', 'tl3', 'tm3', 'tr3'],

  '4-1': ['tl4', 'tm4', 'tr4', 'br4'],
  '4-2': ['tm4', 'tr4', 'br4', 'bm4'],
  '4-3': ['tr4', 'br4', 'bm4', 'bl4'],
  '4-4': ['br4', 'bm4', 'bl4', 'tl4'],
  '4-5': ['bm4', 'bl4', 'tl4', 'tm4'],
  '4-6': ['bl4', 'tl4', 'tm4', 'tr4'],

  // spirals:
  rtl: ['tl1', 'tm2', 'tr3', 'br4'],
  rtm: ['tm1', 'tr2', 'br3', 'bm4'],
  rtr: ['tr1', 'br2', 'bm3', 'bl4'],
  rbr: ['br1', 'bm2', 'bl3', 'tl4'],
  rbm: ['bm1', 'bl2', 'tl3', 'tm4'],
  rbl: ['bl1', 'tl2', 'tm3', 'tr4'],

  ltl: ['tl1', 'bl2', 'bm3', 'br4'],
  ltm: ['tm1', 'tl2', 'bl3', 'bm4'],
  ltr: ['tr1', 'tm2', 'tl3', 'bl4'],
  lbr: ['br1', 'tr2', 'tm3', 'tl4'],
  lbm: ['bm1', 'br2', 'tr3', 'tm4'],
  lbl: ['bl1', 'bm2', 'br3', 'tr4'],
} as const;

export type Player = 'x' | 'o';
export type BoardState = Partial<Record<LocationKey, Player>>;
