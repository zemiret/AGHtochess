import { RootSchema } from "./root-schema";
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import {
  buyUnit,
  closeWebSocket,
  connectWebSocket,
  setUsername,
  showInfoMessage,
  changeGameState,
  selectUnit,
  showErrorMessage,
} from "./actions";
import { InfoMessage } from "../models/info-message.model";
import { GameState, Unit } from "../models/game-state.model";

export const initialState: RootSchema = {
  gameState: undefined,
  state: "login",
  username: "",
  socketState: "closed",
  selectedUnit: undefined,
  message: "",
  messageType: "success",
};

export const rootReducer = createReducer(initialState, {
  [setUsername.type]: (state, action: PayloadAction<string>) => ({
    ...state,
    username: action.payload,
  }),
  [selectUnit.type]: (state, action: PayloadAction<Unit>) => ({
    ...state,
    selectedUnit: action.payload,
  }),
  [buyUnit.pending.type]: (state, _: PayloadAction) => ({ ...state }),
  [buyUnit.fulfilled.type]: (state, _: PayloadAction<number>) => ({
    ...state,
  }),
  [connectWebSocket.pending.type]: (state, _: PayloadAction) => ({
    ...state,
    socketState: "connecting",
  }),
  [connectWebSocket.fulfilled.type]: (state, _: PayloadAction) => ({
    ...state,
    socketState: "open",
    state: "lobby",
  }),
  [connectWebSocket.rejected.type]: (state, _: PayloadAction) => ({
    ...state,
    socketState: "closed",
    state: "login",
  }),
  [closeWebSocket.type]: (state, _: PayloadAction) => ({
    ...state,
    socketState: "closed",
    state: "login",
  }),
  [showInfoMessage.type]: (state, action: PayloadAction<InfoMessage>) => ({
    ...state,
    message: action.payload.message,
    messageType: "success",
  }),
  [showErrorMessage.type]: (state, action: PayloadAction<InfoMessage>) => ({
    ...state,
    message: action.payload.message,
    messageType: "danger",
  }),
  [changeGameState.type]: (state, action: PayloadAction<GameState>) => ({
    ...state,
    gameState: action.payload,
    state: "game",
  }),
});
