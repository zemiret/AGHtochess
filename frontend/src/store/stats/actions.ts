import { createAction } from "@reduxjs/toolkit";

export const statsGamePlayed = createAction("stats/gamePlayed");
export const statsGameWon = createAction("stats/gameWon");
export const statsRoundPlayed = createAction("stats/roundPlayed");
export const statsRoundWon = createAction("stats/roundWon");
export const statsDamageTaken = createAction<number>("stats/damageTaken");
export const statsDamageGiven = createAction<number>("stats/damageGiven");
export const statsKilledUnits = createAction<number>("stats/killedUnits");
export const statsLostUnits = createAction<number>("stats/lostUnits");
