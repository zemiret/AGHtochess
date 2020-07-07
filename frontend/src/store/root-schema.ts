import { GameState } from "../models/game-state.model";

export interface RootSchema {
  gameState?: GameState;
  username: string;
  socket: WebSocket | undefined;
  socketState: "closed" | "connecting" | "open";
}
