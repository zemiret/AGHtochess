import { GameState } from "../models/game-state.model";
import { Dispatch } from "../store";
import React from "react";
import Store from "./Store";
import { buyUnit } from "../store/actions";
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
      return <Store {...gameState} buyUnit={(id: string) => dispatch(buyUnit(id))} />;
    case "BATTLE":
      return (
        <>
          {gameState.battleStatistics.log && (
            <BattleLog
              log={gameState.battleStatistics.log}
              units={gameState.units}
              enemyUnits={gameState.enemyUnits}
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
