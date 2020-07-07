import { RootSchema } from "./root-schema";
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { buyUnit } from "./actions";

export const initialState: RootSchema = {
  gameState: "",
};

export const rootReducer = createReducer(initialState, {
  [buyUnit.pending.type]: (state, _: PayloadAction) => ({ ...state }),
  [buyUnit.fulfilled.type]: (state, action: PayloadAction<number>) => ({
    ...state,
    gameState: state.gameState + "; " + action.payload,
  }),
});
