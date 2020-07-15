import { Stats } from "../models/stats.model";
import { GameState } from "../models/game-state.model";

export interface RootSchema {
  gameState?: GameState;
  state: "login" | "lobby" | "game";
  username: string;
  socketState: "closed" | "connecting" | "open";
  message: string;
  messageType: "success" | "danger";
  messageVisible: boolean;
  stats: Stats
}

export const initialState: RootSchema = {
  gameState: undefined,
  state: "login",
  username: "",
  socketState: "closed",
  message: "",
  messageType: "success",
  messageVisible: false,
  stats: {}
};
