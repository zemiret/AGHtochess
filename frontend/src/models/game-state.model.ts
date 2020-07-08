interface PlayerInfo {
  username: string;
  hp: number;
  money: number;
}

interface Unit {
  id: string;
  attack: number;
  defense: number;
  magicResist: number;
  criticalChance: number;
  hp: number;
  range: number;
  attackSpeed: number;
  type: "MAGICAL" | "PHYSICAL";
  price: number;
}

interface UnitPlacement {
  unitId: number;
  x: number;
  y: number;
}

interface BattleStatistics {
  result: "WIN" | "LOSS";
  hpChange: number;
}

interface Answer {
  id: number;
  text: string;
}

interface Question {
  id: number;
  test: string;
  answers: Answer[];
}

interface CommonGameState {
  phaseEndsAt: Date;
  round: number;
  player: PlayerInfo;
  enemy: PlayerInfo;
  units: Unit[];
  enemyUnits: Unit[];
  unitsPlacement: UnitPlacement[];
  enemyUnitsPlacement: UnitPlacement[];
}

export interface StoreGameState extends CommonGameState {
  phase: "STORE";
  store: Unit[];
}

export interface BattleGameState extends CommonGameState {
  phase: "BATTLE";
  battleStatistics: BattleStatistics;
}

export interface QuestionGameState extends CommonGameState {
  phase: "QUESTION";
  question: Question;
}

export interface GameEndGameState extends CommonGameState {
  phase: "GAME_END";
  gameResult: "WIN" | "LOSS";
}

export type GameState =
  | StoreGameState
  | BattleGameState
  | QuestionGameState
  | GameEndGameState;
