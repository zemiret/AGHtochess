import {
  statsCorrectAnswer,
  statsDamageGiven,
  statsDamageTaken,
  statsGamePlayed,
  statsGameWon,
  statsIncorrectAnswer,
  statsKilledUnits,
  statsLostUnits,
  statsMoneyLost,
  statsMoneySaved,
  statsRoundPlayed,
  statsRoundWon,
} from "./actions";
import { PlayerStats } from "../../models/stats.model";
import { RootSchema } from "../root-schema";
import { PayloadAction } from "@reduxjs/toolkit";

const updatePlayerStats = (state: RootSchema, playerStats: Partial<PlayerStats>) => ({
  ...state,
  stats: {
    ...state.stats,
    [state.username]: {
      ...state.stats[state.username],
      ...playerStats,
    },
  },
});

export const statsReducer = {
  [statsGamePlayed.type]: (state: RootSchema) =>
    updatePlayerStats(state, {
      playedGames: (state.stats[state.username]?.playedGames ?? 0) + 1,
    }),
  [statsGameWon.type]: (state: RootSchema) =>
    updatePlayerStats(state, {
      wonGames: (state.stats[state.username]?.wonGames ?? 0) + 1,
    }),
  [statsRoundPlayed.type]: (state: RootSchema) =>
    updatePlayerStats(state, {
      playedRounds: (state.stats[state.username]?.playedRounds ?? 0) + 1,
    }),
  [statsRoundWon.type]: (state: RootSchema) =>
    updatePlayerStats(state, {
      wonRounds: (state.stats[state.username]?.wonRounds ?? 0) + 1,
    }),
  [statsDamageGiven.type]: (state: RootSchema, action: PayloadAction<number>) =>
    updatePlayerStats(state, {
      damageGiven: (state.stats[state.username]?.damageGiven ?? 0) + action.payload,
    }),
  [statsDamageTaken.type]: (state: RootSchema, action: PayloadAction<number>) =>
    updatePlayerStats(state, {
      damageTaken: (state.stats[state.username]?.damageTaken ?? 0) + action.payload,
    }),
  [statsKilledUnits.type]: (state: RootSchema, action: PayloadAction<number>) =>
    updatePlayerStats(state, {
      unitsKilled: (state.stats[state.username]?.unitsKilled ?? 0) + action.payload,
    }),
  [statsLostUnits.type]: (state: RootSchema, action: PayloadAction<number>) =>
    updatePlayerStats(state, {
      unitsLosts: (state.stats[state.username]?.unitsLosts ?? 0) + action.payload,
    }),
  [statsCorrectAnswer.type]: (state: RootSchema, action: PayloadAction<string>) =>
    updatePlayerStats(state, {
      questionsAnswered: {
        ...state.stats[state.username]?.questionsAnswered,
        [action.payload]:
          (state.stats[state.username]?.questionsAnswered?.[action.payload] ?? 0) + 1,
      },
      questionsCorrect: {
        ...state.stats[state.username]?.questionsCorrect,
        [action.payload]:
          (state.stats[state.username]?.questionsCorrect?.[action.payload] ?? 0) + 1,
      },
    }),
  [statsIncorrectAnswer.type]: (state: RootSchema, action: PayloadAction<string>) =>
    updatePlayerStats(state, {
      questionsAnswered: {
        ...state.stats[state.username]?.questionsCorrect,
        [action.payload]:
          (state.stats[state.username]?.questionsCorrect?.[action.payload] ?? 0) + 1,
      },
    }),
  [statsMoneySaved.type]: (state: RootSchema, action: PayloadAction<number>) =>
    updatePlayerStats(state, {
      moneySaved: (state.stats[state.username]?.moneySaved ?? 0) + action.payload,
    }),
  [statsMoneyLost.type]: (state: RootSchema, action: PayloadAction<number>) =>
    updatePlayerStats(state, {
      moneyLost: (state.stats[state.username]?.moneyLost ?? 0) + action.payload,
    }),
};
