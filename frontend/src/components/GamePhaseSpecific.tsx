import React from "react";
import { GameState } from "../models/game-state.model";
import { RootSchema } from "../store/root-schema";
import { connect } from "react-redux";
import Store from "./Store";
import GameEnd from "./GameEnd";
import Battle from "./Battle";
import Question from "./Question";

interface Props {
  gameState: GameState;
}

const GamePhaseSpecific: React.FunctionComponent<Props> = ({ gameState }: Props) => {
  switch (gameState.phase) {
    case "STORE":
      return (
        <Store {...gameState} buyUnit={(id: number) => console.log(`Buying ${id}`)} />
      );
    case "BATTLE":
      return <Battle {...gameState.battleStatistics} />;
    case "QUESTION":
      return <Question {...gameState.question} />;
    case "GAME_END":
      return <GameEnd gameResult={gameState.gameResult} />;
  }
};

const mapStateToProps = (state: RootSchema) => ({
  gameState: state.gameState!,
});

export default connect(mapStateToProps)(GamePhaseSpecific);
