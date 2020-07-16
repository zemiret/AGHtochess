import React from "react";
import { GameState, UnitPlacement } from "../models/game-state.model";
import { RootSchema } from "../store/root-schema";
import { connect } from "react-redux";
import GameEnd from "./GameEnd";
import BattleResult from "./BattleResult";
import { Dispatch } from "../store";
import { placeUnit } from "../store/actions";
import Gameboard from "./Gameboard";

interface Props {
  gameState: GameState;
  dispatch: Dispatch;
}

const GamePhaseSpecificCenter: React.FunctionComponent<Props> = ({
  gameState,
  dispatch,
}: Props) => {
  switch (gameState.phase) {
    case "STORE":
      return (
        <Gameboard
          {...gameState}
          placeUnit={(unitsPlacement: UnitPlacement) =>
            dispatch(placeUnit(unitsPlacement))
          }
          units={[...gameState.units, ...gameState.enemyUnits]}
        />
      );
    case "BATTLE":
      return (
        <Gameboard
          {...gameState}
          units={[...gameState.units, ...gameState.enemyUnits]}
        />
      );
    case "BATTLE_RESULT":
      return gameState.battleStatistics ? (
        <BattleResult {...gameState.battleStatistics} />
      ) : null;
    case "GAME_END":
      return <GameEnd gameResult={gameState.gameResult} />;
  }
};

const mapStateToProps = (state: RootSchema) => ({
  gameState: state.gameState!,
});

export default connect(mapStateToProps)(GamePhaseSpecificCenter);
