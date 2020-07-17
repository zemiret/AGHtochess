import React from "react";
import { GameResult } from "../models/game-state.model";

interface Props {
  gameResult: GameResult;
}

const GameEnd: React.FunctionComponent<Props> = ({ gameResult }: Props) => {
  switch (gameResult) {
    case "WIN":
      return (
        <div className="battle-result battle-result-success">
          <h1>Victory</h1>
        </div>
      );
    case "DRAW":
      return (
        <div className="battle-result">
          <h1>Draw</h1>
        </div>
      );
    case "LOSS":
      return (
        <div className="battle-result battle-result-danger">
          <h1>Defeat</h1>
        </div>
      );
  }
};

export default GameEnd;
