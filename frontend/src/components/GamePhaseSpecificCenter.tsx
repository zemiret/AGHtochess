import React from "react";
import { GameState, UnitPlacement } from "../models/game-state.model";
import { RootSchema } from "../store/root-schema";
import { connect } from "react-redux";
import GameEnd from "./GameEnd";
import Battle from "./Battle";
import Question from "./Question";
import { Dispatch } from "../store";
import { placeUnit, answerQuestion } from "../store/actions";
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
        />
      );
    case "BATTLE":
      return <Battle {...gameState.battleStatistics} />;
    case "QUESTION":
      return (
        <Question
          {...gameState.question}
          answerQuestion={(q: number, a: number) =>
            dispatch(answerQuestion({ questionId: q, answerId: a }))
          }
        />
      );
    case "GAME_END":
      return <GameEnd gameResult={gameState.gameResult} />;
  }
};

const mapStateToProps = (state: RootSchema) => ({
  gameState: state.gameState!,
});

export default connect(mapStateToProps)(GamePhaseSpecificCenter);
