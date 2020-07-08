import { GameState } from "../models/game-state.model";

export interface RootSchema {
  gameState?: GameState;
  state: "login" | "lobby" | "game";
  username: string;
  socket?: WebSocket;
  socketState: "closed" | "connecting" | "open";
}
