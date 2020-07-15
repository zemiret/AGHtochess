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

export interface StoreUnit {
  unit: Unit;
  questions: {
    [questionDifficulty: string]: Question;
  };
}

export interface UnitPlacement {
  unitId: string;
  x: number;
  y: number;
}

export interface BattleStatistics {
  result: GameResult;
  playerHpChange: number;
  log: Array<BattleAction>;
}

export interface BattleAction {
  who: string;
  whom: string;
  action: "kill" | "damage";
  damage: number;
}

export interface Answer {
  id: number;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  answers: Answer[];
  difficulty: string;
}

export interface CommonGameState {
  phaseEndsAt: number;
  round: number;
  player: PlayerInfo;
  enemy?: PlayerInfo;
  units: Unit[];
  enemyUnits: Unit[];
  unitsPlacement: UnitPlacement[];
  enemyUnitsPlacement: UnitPlacement[];
}

export interface StoreGameState extends CommonGameState {
  phase: "STORE";
  store: StoreUnit[];
}

export interface BattleGameState extends CommonGameState {
  phase: "BATTLE";
  battleStatistics?: BattleStatistics;
}

export interface BattleResultGameState extends CommonGameState {
  phase: "BATTLE_RESULT";
  battleStatistics?: BattleStatistics;
}

export interface GameEndGameState extends CommonGameState {
  phase: "GAME_END";
  gameResult: "WIN" | "LOSS";
}

export enum GameType {
  DUEL = "DUEL",
  ROYALE = "ROYALE",
}

export enum QuestionDifficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export interface WebsocketOptions {
  username: string;
  gameType: string;
}

export interface BuyUnitWithDiscountPayload {
  id: string;
  questionDifficulty: QuestionDifficulty;
  answerId: number;
}

export type GameResult = "WIN" | "LOSS" | "DRAW";

export type GameState =
  | StoreGameState
  | BattleGameState
  | BattleResultGameState
  | GameEndGameState;
