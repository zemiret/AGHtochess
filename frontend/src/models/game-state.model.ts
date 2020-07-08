export interface PlayerInfo {
  username: string;
  hp: number;
  money: number;
}

export interface Unit {
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

export interface UnitPlacement {
  unitId: number;
  x: number;
  y: number;
}

export interface BattleStatistics {
  result: "WIN" | "LOSS";
  hpChange: number;
}

export interface Answer {
  id: number;
  text: string;
}

export interface Question {
  id: number;
  test: string;
  answers: Answer[];
}

export interface CommonGameState {
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
