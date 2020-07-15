import { QuestionDifficulty } from "./models/game-state.model";

export const MAX_PLAYER_HP = 100;
export const BOARD_WIDTH = 6;
export const BOARD_HEIGHT = 8;

export const STAT_COLORS: { [key: string]: string } = Object.freeze({
  hp: "hsla(360, 100%, 50%, 1)",
  defense: "gray",
  attack: "hsla(360, 100%, 50%, 1)",
  magicResist: "hsla(240, 100%, 50%, 1)",
  range: "hsla(120, 50%, 50%, 1)",
  criticalChance: "hsla(26, 100%, 50%, 1)",
});

export const QUESTION_DIFFICULTY_MULTIPLIERS = {
  [QuestionDifficulty.EASY]: 0.9,
  [QuestionDifficulty.MEDIUM]: 0.7,
  [QuestionDifficulty.HARD]: 0.5,
};
