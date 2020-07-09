import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import * as api from "../api";
import { GameState, Unit, UnitPlacement } from "../models/game-state.model";
import { InfoMessage } from "../models/info-message.model";
import { MessageType } from "../models/message-type.enum";

export const setUsername = createAction<string>("setUsername");

export const closeWebSocket = createAction("closeWebSocket");

export const changeGameState = createAction<GameState>("changeGameState");

export const showInfoMessage = createAction<InfoMessage>("showInfoMessage");

export const selectUnit = createAction<Unit>("selectUnit");
export const showErrorMessage = createAction<InfoMessage>("showErrorMessage");

export const connectWebSocket = createAsyncThunk(
  "connectWebSocket",
  async (username: string, thunkApi) => {
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
          console.log("Received unknown message");
      }
    };
    const onClosed = () => {
      thunkApi.dispatch(closeWebSocket());
    };
    return await api.connect(username, onMessage, onClosed);
  },
);

export const buyUnit = createAsyncThunk("buyUnit", async (id: string) => {
  return api.buyUnit(id);
});

export const answerQuestion = createAsyncThunk(
  "answerQuestion",
  async ({ questionId, answerId }: { questionId: number; answerId: number }) => {
    return api.answerQuestion(questionId, answerId);
  },
);

export const placeUnit = createAsyncThunk(
  "placeUnit",
  async (unitPlacement: UnitPlacement) => {
    return api.placeUnit(unitPlacement);
  },
);

export const unplaceUnit = createAsyncThunk("unplaceUnit", async (unitId: string) => {
  return api.unplaceUnit(unitId);
});
