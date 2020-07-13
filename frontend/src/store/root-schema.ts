import { GameState, Unit } from "../models/game-state.model";
import { Stats } from "../models/stats.model";

export interface RootSchema {
  gameState?: GameState;
  state: "login" | "lobby" | "game";
  username: string;
  socketState: "closed" | "connecting" | "open";
  selectedUnit?: Unit;
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
  selectedUnit: undefined,
  message: "",
  messageType: "success",
  messageVisible: false,
  stats: {} as Stats
};
