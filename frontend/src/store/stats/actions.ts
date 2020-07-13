import { createAction } from "@reduxjs/toolkit";

export const gamePlayed = createAction("stats/gamePlayed")
export const gameWon = createAction("stats/gameWon")
export const roundPlayed = createAction("stats/roundPlayed")
export const roundWon = createAction("stats/roundWon")