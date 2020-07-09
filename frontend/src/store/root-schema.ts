import { GameState, Unit } from "../models/game-state.model";

export interface RootSchema {
  gameState?: GameState;
  state: "login" | "lobby" | "game";
  username: string;
  socketState: "closed" | "connecting" | "open";
  selectedUnit: Unit | null;
}
