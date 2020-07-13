import { GameState } from "../models/game-state.model";

export interface RootSchema {
  gameState?: GameState;
  state: "login" | "lobby" | "game";
  username: string;
  socketState: "closed" | "connecting" | "open";
  message: string;
  messageType: "success" | "danger";
  messageVisible: boolean;
}
