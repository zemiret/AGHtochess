import { GamePhase } from "./game-phase.enum";

export interface GameState {
  phase: GamePhase;
  phaseEndsAt: Date;
  round: number;

  // TODO: another fields
}
