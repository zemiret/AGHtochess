import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { connect, Message } from "../api";
import { GameState } from "../models/game-state.model";
import { InfoMessage } from "../models/info-message.model";
import { MessageType } from "../models/message-type.enum";

export const setUsername = createAction<string>("setUsername");

export const buyUnit = createAsyncThunk("buyUnit", async (_: number) => {
  return 1;
});

export const closeWebSocket = createAction("closeWebSocket");

export const changeGameState = createAction<GameState>("changeGameState");

export const showInfoMessage = createAction<InfoMessage>("showInfoMessage");

export const connectWebSocket = createAsyncThunk(
  "connectWebSocket",
  async (username: string, thunkApi) => {
    const onMessage = (message: Message) => {
      switch (message.messageType) {
        case MessageType.INFO:
          thunkApi.dispatch(showInfoMessage(message.payload as InfoMessage));
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
    return await connect(username, onMessage, onClosed);
  },
);
