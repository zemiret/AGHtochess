import { RootSchema } from "./root-schema";
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import {
  buyUnit,
  closeWebSocket,
  connectWebSocket,
  setUsername,
  showInfoMessage,
  changeGameState,
  showErrorMessage,
  hideMessage,
} from "./actions";
import { InfoMessage } from "../models/info-message.model";
import { GameState } from "../models/game-state.model";

export const initialState: RootSchema = {
  gameState: undefined,
  state: "login",
  username: "",
  socketState: "closed",
  message: "",
  messageType: "success",
  messageVisible: false,
};

export const rootReducer = createReducer(initialState, {
  [setUsername.type]: (state, action: PayloadAction<string>) => ({
    ...state,
    username: action.payload,
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
    messageVisible: true,
  }),
  [showErrorMessage.type]: (state, action: PayloadAction<InfoMessage>) => ({
    ...state,
    message: action.payload.message,
    messageType: "danger",
    messageVisible: true,
  }),
  [hideMessage.type]: (state, _: PayloadAction) => ({
    ...state,
    messageVisible: false,
  }),
  [changeGameState.type]: (state, action: PayloadAction<GameState>) => ({
    ...state,
    gameState: action.payload,
    state: "game",
  }),
});
