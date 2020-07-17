import React from "react";
import { BattleStatistics } from "../models/game-state.model";

type Props = BattleStatistics;

const BattleResult: React.FunctionComponent<Props> = ({
  result,
  playerHpChange,
}: Props) => {
  switch (result) {
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
          <p>HP lost: {playerHpChange}</p>
        </div>
      );
  }
};

export default BattleResult;
