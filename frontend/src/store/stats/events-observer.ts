import { PayloadAction } from "@reduxjs/toolkit";
import { AnyAction, MiddlewareAPI } from "redux";
import {
  BattleGameState,
  StoreGameState,
  BuyUnitWithDiscountPayload,
  GameEndGameState,
} from "../../models/game-state.model";
import { InfoMessage } from "../../models/info-message.model";
import { buyUnitWithDiscount, showErrorMessage, showInfoMessage } from "../actions";
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
  statsMoneySaved,
  statsMoneyLost,
  statsCorrectAnswer,
  statsIncorrectAnswer,
} from "./actions";

export class EventsObserver {
  currentState = initialState;
  buyUnitsRequests: { [key: string]: string } = {};

  storeChanged(state: MiddlewareAPI, action: AnyAction) {
    if (action.type.startsWith("stats")) return;

    const newState = state.getState();
    const prevState = this.currentState;
    this.currentState = newState;
    const checkers: ((
      prevState: RootSchema,
      state: RootSchema,
      action: AnyAction,
    ) => AnyAction[] | null)[] = [
      EventsObserver.checkNewGame,
      EventsObserver.checkGameWon,
      EventsObserver.checkNewRound,
      EventsObserver.checkRoundWon,
      EventsObserver.checkDamages,
      EventsObserver.checkMoneySpent,
      this.checkCorrectAnswer.bind(this),
    ];
    this.saveBuyRequests(action);
    checkers.forEach(checker => {
      const statsActions = checker(prevState, this.currentState, action);
      if (statsActions) {
        statsActions.forEach(state.dispatch);
      }
    });
  }

  private static checkNewGame(
    prevState: RootSchema,
    newState: RootSchema,
    _: AnyAction,
  ): AnyAction[] | null {
    return prevState.state !== newState.state && newState.state === "game"
      ? [statsGamePlayed()]
      : null;
  }

  private static checkGameWon(
    prevState: RootSchema,
    newState: RootSchema,
    _: AnyAction,
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
    _: AnyAction,
  ): AnyAction[] | null {
    return prevState.gameState?.phase !== newState.gameState?.phase &&
      newState.gameState?.phase === "STORE"
      ? [statsRoundPlayed()]
      : null;
  }

  private static checkRoundWon(
    prevState: RootSchema,
    newState: RootSchema,
    _: AnyAction,
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
    _: AnyAction,
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

  private static getPriceFromMessage(message: string): number {
    const startIndex = message.indexOf("-") + 1;
    const endIndex = message.indexOf("€") - 1;
    return Number(message.substring(startIndex, endIndex));
  }

  private static checkMoneySpent(
    _: RootSchema,
    _2: RootSchema,
    action: AnyAction,
  ): AnyAction[] | null {
    const payloadAction = action as PayloadAction<InfoMessage>;
    if (
      action.type === showInfoMessage.type &&
      payloadAction.payload.message.includes("Unit bought")
    ) {
      return [
        statsMoneySaved(
          EventsObserver.getPriceFromMessage(payloadAction.payload.message),
        ),
      ];
    }
    if (
      action.type === showErrorMessage.type &&
      payloadAction.payload.message.includes("Incorrect answer")
    ) {
      return [
        statsMoneyLost(
          EventsObserver.getPriceFromMessage(payloadAction.payload.message),
        ),
      ];
    }
    return null;
  }

  private saveBuyRequests(action: AnyAction): AnyAction[] | null {
    if (action.type === buyUnitWithDiscount.pending.type) {
      const payload = action.meta.arg as BuyUnitWithDiscountPayload;
      this.buyUnitsRequests[payload.id] = payload.questionDifficulty;
    }
    return null;
  }

  private checkCorrectAnswer(
    prevState: RootSchema,
    newState: RootSchema,
    _: AnyAction,
  ): AnyAction[] | null {
    if (newState.gameState?.phase !== "STORE" || prevState.gameState?.phase !== "STORE")
      return null;
    const prevStoreUnits = (prevState?.gameState as StoreGameState)?.store?.map(
      u => u.unit.id,
    );
    const newStoreUnits = (newState?.gameState as StoreGameState)?.store?.map(
      u => u.unit.id,
    );
    if (newStoreUnits.length < prevStoreUnits.length) {
      const newStoreSet = new Set(newStoreUnits);
      const removedUnit = prevStoreUnits.find(u => !newStoreSet.has(u));
      const currentUnits = new Set(newState?.gameState?.units?.map(u => u.id));
      if (removedUnit && this.buyUnitsRequests[removedUnit]) {
        const type = this.buyUnitsRequests[removedUnit];
        return [
          currentUnits.has(removedUnit)
            ? statsCorrectAnswer(type)
            : statsIncorrectAnswer(type),
        ];
      }
    }
    return null;
  }
}
