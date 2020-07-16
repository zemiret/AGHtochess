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
  changeView,
  damageUnit,
} from "./actions";
import { InfoMessage } from "../models/info-message.model";
import { GameState, Unit } from "../models/game-state.model";
import { DamageUnit } from "../models/damage-unit.model";
import { statsReducer } from "./stats/reducers";
import { initialState, RootSchema } from "./root-schema";

function damageUnitMapper(command: DamageUnit) {
  return (unit: Unit): Unit => {
    if (unit.id !== command.unitId) {
      return unit;
    }
    const newUnit = { ...unit };
    newUnit.hp -= command.damage;
    return newUnit;
  };
}

export const rootReducer = createReducer(initialState, {
  [setUsername.type]: (state: RootSchema, action: PayloadAction<string>) => ({
    ...state,
    username: action.payload,
  }),
  [changeView.type]: (state: RootSchema, action: PayloadAction<string>) => ({
    ...state,
    state: action.payload,
  }),
  [damageUnit.type]: (state: RootSchema, action: PayloadAction<DamageUnit>) => ({
    ...state,
    gameState: state.gameState
      ? {
          ...state.gameState,
          units: state.gameState.units.map(damageUnitMapper(action.payload)),
          enemyUnits: state.gameState.enemyUnits.map(damageUnitMapper(action.payload)),
        }
      : undefined,
  }),
  [buyUnit.pending.type]: (state: RootSchema, _: PayloadAction) => ({ ...state }),
  [buyUnit.fulfilled.type]: (state: RootSchema, _: PayloadAction<number>) => ({
    ...state,
  }),
  [connectWebSocket.pending.type]: (state: RootSchema, _: PayloadAction) => ({
    ...state,
    socketState: "connecting",
  }),
  [connectWebSocket.fulfilled.type]: (state: RootSchema, _: PayloadAction) => ({
    ...state,
    socketState: "open",
    state: "lobby",
  }),
  [connectWebSocket.rejected.type]: (state: RootSchema, _: PayloadAction) => ({
    ...state,
    socketState: "closed",
    state: "login",
  }),
  [closeWebSocket.type]: (state: RootSchema, _: PayloadAction) => ({
    ...state,
    socketState: "closed",
    state: "login",
  }),
  [showInfoMessage.type]: (state: RootSchema, action: PayloadAction<InfoMessage>) => ({
    ...state,
    message: action.payload.message,
    messageType: "success",
    messageVisible: true,
  }),
  [showErrorMessage.type]: (state: RootSchema, action: PayloadAction<InfoMessage>) => ({
    ...state,
    message: action.payload.message,
    messageType: "danger",
    messageVisible: true,
  }),
  [hideMessage.type]: (state: RootSchema, _: PayloadAction) => ({
    ...state,
    messageVisible: false,
  }),
  [changeGameState.type]: (state: RootSchema, action: PayloadAction<GameState>) => ({
    ...state,
    gameState: action.payload,
    state: "game",
  }),
  ...statsReducer,
} as any);
