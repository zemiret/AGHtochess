import { RootSchema } from "./root-schema";
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { buyUnit, closeWebSocket, connectWebSocket, setUsername } from "./actions";

export const initialState: RootSchema = {
  state: "login",
  gameState: "",
  username: "",
  socket: undefined,
  socketState: "closed",
};

export const rootReducer = createReducer(initialState, {
  [setUsername.type]: (state, action: PayloadAction<string>) => ({
    ...state,
    username: action.payload,
  }),
  [buyUnit.pending.type]: (state, _: PayloadAction) => ({ ...state }),
  [buyUnit.fulfilled.type]: (state, action: PayloadAction<number>) => ({
    ...state,
    gameState: state.gameState + "; " + action.payload,
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
});
