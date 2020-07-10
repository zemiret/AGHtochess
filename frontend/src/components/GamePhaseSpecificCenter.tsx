import React from "react";
import { GameState, Unit, UnitPlacement } from "../models/game-state.model";
import { RootSchema } from "../store/root-schema";
import { connect } from "react-redux";
import GameEnd from "./GameEnd";
import Battle from "./Battle";
import Question from "./Question";
import { Dispatch } from "../store";
import { answerQuestion, placeUnit, unplaceUnit } from "../store/actions";
import Gameboard from "./Gameboard";

interface Props {
  gameState: GameState;
  selectedUnit?: Unit;
  dispatch: Dispatch;
}

const GamePhaseSpecificCenter: React.FunctionComponent<Props> = ({
  gameState,
  dispatch,
  selectedUnit,
}: Props) => {
  switch (gameState.phase) {
    case "STORE":
      return (
        <Gameboard
          {...gameState}
          selectedUnit={selectedUnit}
          placeUnit={(unitsPlacement: UnitPlacement) =>
            dispatch(placeUnit(unitsPlacement))
          }
          units={[...gameState.units, ...gameState.enemyUnits]}
          unplaceUnit={(unitId: string) => dispatch(unplaceUnit(unitId))}
        />
      );
    case "BATTLE":
      return <Battle {...gameState.battleStatistics} />;
    case "QUESTION":
      return (
        !!gameState.question && (
          <Question
            {...gameState.question}
            answerQuestion={(q: number, a: number) =>
              dispatch(answerQuestion({ questionId: q, answerId: a }))
            }
          />
        )
      );
    case "GAME_END":
      return <GameEnd gameResult={gameState.gameResult} />;
  }
};

const mapStateToProps = (state: RootSchema) => ({
  gameState: state.gameState!,
  selectedUnit: state.selectedUnit,
});

export default connect(mapStateToProps)(GamePhaseSpecificCenter);
