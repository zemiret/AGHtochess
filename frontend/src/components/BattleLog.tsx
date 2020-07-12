import React from "react";
import { BattleAction, Unit } from "../models/game-state.model";
import BattleLogItem from "./BattleLogItem";
import { ListGroup } from "reactstrap";
import Caption from "./Caption";

interface Props {
  log: Array<BattleAction>;
  units: Array<Unit>;
  enemyUnits: Array<Unit>;
}

const BattleLog: React.FunctionComponent<Props> = ({
  log,
  units,
  enemyUnits,
}: Props) => {
  return (
    <div>
      <Caption text="Battle log"></Caption>
      <ListGroup flush>
        {log.map((action, i) => (
          <BattleLogItem
            key={i}
            action={action}
            units={units}
            enemyUnits={enemyUnits}
          />
        ))}
      </ListGroup>
    </div>
  );
};

export default BattleLog;
