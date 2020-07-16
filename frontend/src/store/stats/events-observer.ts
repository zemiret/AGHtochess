import { AnyAction, MiddlewareAPI } from "redux";
import { BattleGameState, GameEndGameState } from "../../models/game-state.model";
import { initialState, RootSchema } from "../root-schema";
import {
  statsGamePlayed,
  statsGameWon,
  statsRoundPlayed,
  statsRoundWon,
  statsDamageGiven,
  statsDamageTaken,
  statsKilledUnits,
  statsLostUnits,
} from "./actions";

export class EventsObserver {
  currentState = initialState;

  storeChanged(state: MiddlewareAPI, action: AnyAction) {
    if (action.type.startsWith("stats")) return;

    const newState = state.getState();
    const prevState = this.currentState;
    this.currentState = newState;
    const checkers: ((
      prevState: RootSchema,
      state: RootSchema,
    ) => AnyAction[] | null)[] = [
      EventsObserver.checkNewGame,
      EventsObserver.checkGameWon,
      EventsObserver.checkNewRound,
      EventsObserver.checkRoundWon,
      EventsObserver.checkDamages,
    ];
    checkers.forEach(checker => {
      const statsActions = checker(prevState, this.currentState);
      if (statsActions) {
        statsActions.forEach(state.dispatch);
      }
    });
  }

  private static checkNewGame(
    prevState: RootSchema,
    newState: RootSchema,
  ): AnyAction[] | null {
    return prevState.state !== newState.state && newState.state === "game"
      ? [statsGamePlayed()]
      : null;
  }

  private static checkGameWon(
    prevState: RootSchema,
    newState: RootSchema,
  ): AnyAction[] | null {
    return prevState.gameState?.phase !== newState.gameState?.phase &&
      newState.gameState?.phase === "GAME_END" &&
      (newState.gameState as GameEndGameState).gameResult === "WIN"
      ? [statsGameWon()]
      : null;
  }

  private static checkNewRound(
    prevState: RootSchema,
    newState: RootSchema,
  ): AnyAction[] | null {
    return prevState.gameState?.phase !== newState.gameState?.phase &&
      newState.gameState?.phase === "STORE"
      ? [statsRoundPlayed()]
      : null;
  }

  private static checkRoundWon(
    prevState: RootSchema,
    newState: RootSchema,
  ): AnyAction[] | null {
    return prevState.gameState?.phase !== newState.gameState?.phase &&
      newState.gameState?.phase === "BATTLE" &&
      (newState.gameState as BattleGameState)?.battleStatistics?.result === "WIN"
      ? [statsRoundWon()]
      : null;
  }

  private static checkDamages(
    prevState: RootSchema,
    newState: RootSchema,
  ): AnyAction[] | null {
    if (
      prevState.gameState?.phase !== newState.gameState?.phase &&
      newState.gameState?.phase === "BATTLE"
    ) {
      const myUnits = new Set(newState.gameState?.units?.map(u => u.id) ?? []);
      let damageTaken = 0;
      let damageGiven = 0;
      let killedUnits = 0;
      let lostUnits = 0;
      newState.gameState?.battleStatistics?.log?.forEach(battleAction => {
        if (battleAction.action === "damage" && myUnits.has(battleAction.whom)) {
          damageTaken += battleAction.damage;
        }
        if (battleAction.action === "damage" && myUnits.has(battleAction.who)) {
          damageGiven += battleAction.damage;
        }
        if (battleAction.action === "kill" && myUnits.has(battleAction.who)) {
          killedUnits += 1;
        }
        if (battleAction.action === "kill" && myUnits.has(battleAction.whom)) {
          lostUnits += 1;
        }
      });
      return [
        statsDamageGiven(damageGiven),
        statsDamageTaken(damageTaken),
        statsKilledUnits(killedUnits),
        statsLostUnits(lostUnits),
      ];
    }
    return null;
  }
}
