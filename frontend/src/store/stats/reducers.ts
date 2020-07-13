// import { createReducer } from "@reduxjs/toolkit";
// import { initialState } from "../root-schema";
import { gamePlayed, gameWon, roundPlayed, roundWon } from "./actions";
import { PlayerStats } from "../../models/stats.model";
import { RootSchema } from "../root-schema";

export const statsReducer =  {
    [gamePlayed.type]: (state: RootSchema) => updatePlayerStats(state, {
        playedGames: (state.stats[state.username]?.playedGames ?? 0) + 1
    }),
    [gameWon.type]: (state: RootSchema) => updatePlayerStats(state, {
        wonGames: (state.stats[state.username]?.wonGames ?? 0) + 1
    }),
    [roundPlayed.type]: (state: RootSchema) => updatePlayerStats(state, {
        playedRounds: (state.stats[state.username]?.playedRounds ?? 0) + 1
    }),
    [roundWon.type]: (state: RootSchema) => updatePlayerStats(state, {
        wonRounds: (state.stats[state.username]?.wonRounds ?? 0) + 1
    }),
};

const updatePlayerStats = (state: RootSchema, playerStats: Partial<PlayerStats>) => ({
    ...state,
    stats: {
        ...state.stats,
        [state.username]: {
            ...state.stats[state.username],
            ...playerStats
        }
    }
})
