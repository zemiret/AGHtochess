import { GameState, QuestionDifficulty } from "../models/game-state.model";
import { DamageUnit } from "../models/damage-unit.model";
import { Dispatch } from "../store";
import React from "react";
import Store from "./Store";
import { buyUnit, buyUnitWithDiscount, damageUnit } from "../store/actions";
import { RootSchema } from "../store/root-schema";
import { connect } from "react-redux";
import BattleLog from "./BattleLog";

interface Props {
  gameState: GameState;
  dispatch: Dispatch;
}

const GamePhaseSpecificSidebar: React.FunctionComponent<Props> = ({
  gameState,
  dispatch,
}: Props) => {
  switch (gameState.phase) {
    case "STORE":
      return (
        <Store
          {...gameState}
          playerMoney={gameState.player.money}
          buyUnit={(id: string) => dispatch(buyUnit(id))}
          buyUnitWithDiscount={(
            id: string,
            questionDifficulty: QuestionDifficulty,
            answerId: number,
          ) =>
            dispatch(
              buyUnitWithDiscount({
                id,
                questionDifficulty,
                answerId,
              }),
            )
          }
        />
      );
    case "BATTLE":
    case "BATTLE_RESULT":
      return (
        <>
          {gameState.battleStatistics?.log && (
            <BattleLog
              log={gameState.battleStatistics?.log}
              units={gameState.units}
              enemyUnits={gameState.enemyUnits}
              damageUnit={(command: DamageUnit) => dispatch(damageUnit(command))}
            />
          )}
        </>
      );
    default:
      return null;
  }
};

const mapStateToProps = (state: RootSchema) => ({
  gameState: state.gameState!,
});

export default connect(mapStateToProps)(GamePhaseSpecificSidebar);
