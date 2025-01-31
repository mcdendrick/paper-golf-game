export const CELL_TYPES = {
  ROUGH: 'rough',
  FAIRWAY: 'fairway',
  SAND: 'sand',
  WATER: 'water',
  TREE: 'tree',
  HOLE: 'hole',
  START: 'start',
  SLOPE: 'slope'
} as const;

export type CellType = typeof CELL_TYPES[keyof typeof CELL_TYPES];

export type Position = {
  x: number;
  y: number;
};

export type PathSegment = {
  from: Position;
  to: Position;
};

export type CourseInfo = {
  name: string;
  currentHole: number;
  totalHoles: number;
  par: number;
};

export type GameState = {
  ballPosition: Position;
  strokes: number;
  path: PathSegment[];
  lastRoll: number | null;
  gameOver: boolean;
  mulligansUsed: number;
  hasUsedFreeTee: boolean;
  puttableSquares: Position[];
  isPutting: boolean;
  course: CourseInfo;
};

export type Grid = CellType[][];

export type SlopeDirection = 'up' | 'down' | 'left' | 'right' | 'upLeft' | 'upRight' | 'downLeft' | 'downRight';

export type CellWithSlope = {
  type: CellType;
  slope?: SlopeDirection;
}; 