import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { connect } from "../api";

export const setUsername = createAction<string>("setUsername");

export const buyUnit = createAsyncThunk("buyUnit", async (_: number) => {
  return 1;
});

export const connectWebSocket = createAsyncThunk(
  "connectWebSocket",
  async (username: string) => {
    return await connect(username);
  },
);

export const closeWebSocket = createAction("closeWebSocket");
