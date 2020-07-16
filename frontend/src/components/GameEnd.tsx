import React from "react";
import { GameResult } from "../models/game-state.model";

interface Props {
  gameResult: GameResult;
}

const GameEnd: React.FunctionComponent<Props> = ({ gameResult }: Props) => {
  switch (gameResult) {
    case "WIN":
      return <h1>You Win!</h1>;
    case "DRAW":
      return <h1>Draw</h1>;
    case "LOSS":
      return <h1>You Lose!</h1>;
  }
};

export default GameEnd;
