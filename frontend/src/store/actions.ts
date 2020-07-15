import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import * as api from "../api";
import {
  BuyUnitWithDiscountPayload,
  GameState,
  UnitPlacement,
  WebsocketOptions,
} from "../models/game-state.model";
import { InfoMessage } from "../models/info-message.model";
import { MessageType } from "../models/message-type.enum";
import { DamageUnit } from "../models/damage-unit.model";

export const setUsername = createAction<string>("setUsername");
export const changeView = createAction<string>("changeView")
export const closeWebSocket = createAction("closeWebSocket");

export const changeGameState = createAction<GameState>("changeGameState");

export const showInfoMessage = createAction<InfoMessage>("showInfoMessage");
export const showErrorMessage = createAction<InfoMessage>("showErrorMessage");
export const hideMessage = createAction("hideMessage");

export const damageUnit = createAction<DamageUnit>("damageUnit");

export const connectWebSocket = createAsyncThunk(
  "connectWebSocket",
  async (options: WebsocketOptions, thunkApi) => {
    const onMessage = (message: api.Message) => {
      switch (message.messageType) {
        case MessageType.INFO:
          thunkApi.dispatch(showInfoMessage(message.payload as InfoMessage));
          break;
        case MessageType.ERROR:
          thunkApi.dispatch(showErrorMessage(message.payload as InfoMessage));
          break;
        case MessageType.STATE_CHANGE:
          thunkApi.dispatch(changeGameState(message.payload as GameState));
          break;
        default:
          console.log("Received unknown message: ", message);
      }
    };
    const onClosed = () => {
      thunkApi.dispatch(closeWebSocket());
    };
    return await api.connect(options.username, options.gameType, onMessage, onClosed);
  },
);

export const buyUnit = createAsyncThunk("buyUnit", async (id: string) => {
  return api.buyUnit(id);
});

export const buyUnitWithDiscount = createAsyncThunk(
  "buyUnitWithDiscount",
  async ({ id, questionDifficulty, answerId }: BuyUnitWithDiscountPayload) => {
    return api.buyUnitWithDiscount(id, questionDifficulty, answerId);
  },
);

export const sellUnit = createAsyncThunk("sellUnit", async (id: string) => {
  return api.sellUnit(id);
});

export const placeUnit = createAsyncThunk(
  "placeUnit",
  async (unitPlacement: UnitPlacement) => {
    return api.placeUnit(unitPlacement);
  },
);

export const unplaceUnit = createAsyncThunk("unplaceUnit", async (unitId: string) => {
  return api.unplaceUnit(unitId);
});
