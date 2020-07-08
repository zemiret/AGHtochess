import React from "react";
import { BattleStatistics } from "../models/game-state.model";

type Props = BattleStatistics;

const Battle: React.FunctionComponent<Props> = (props: Props) => {
  return (
    <div>
      <h3>Battle Result: {props.result}</h3>
      <p>HP lost: {props.playerHpChange}</p>
    </div>
  );
};

export default Battle;
