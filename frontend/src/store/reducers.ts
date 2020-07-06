import { RootSchema } from "./root-schema";
import { createReducer, PayloadAction } from "@reduxjs/toolkit"

export const initialState: RootSchema = {
    gameState: ""
}

export const rootReducer = createReducer(initialState, {
    buyUnit: (state, action: PayloadAction<{unitId: number}>) => ({
        ...state,
        gameState: state.gameState+";"+action.payload
    })
})