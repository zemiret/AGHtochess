import React, { useState, useEffect, useRef } from "react";
import { BattleAction, Unit } from "../models/game-state.model";
import { DamageUnit } from "../models/damage-unit.model";
import BattleLogItem from "./BattleLogItem";
import { ListGroup } from "reactstrap";
import Caption from "./Caption";

interface Props {
  log: Array<BattleAction>;
  units: Array<Unit>;
  enemyUnits: Array<Unit>;
  damageUnit: (command: DamageUnit) => void;
}

const actionDuration = 200;

const BattleLog: React.FunctionComponent<Props> = ({
  log,
  units,
  enemyUnits,
  damageUnit,
}: Props) => {
  const [currentLog, setCurrentLog] = useState<Array<BattleAction>>([]);
  const lastElement = useRef<HTMLDivElement>(null);
  const [lastExecute, setLastExecute] = useState<number>(performance.now());

  useEffect(() => {
    if (currentLog.length === log.length) return;
    const timer = setTimeout(() => {
      setLastExecute(performance.now());
      if (currentLog.length === log.length) return;
      const nextAction = log[currentLog.length];
      damageUnit({
        unitId: nextAction.whom,
        damage: nextAction.damage,
      });
      setCurrentLog([nextAction, ...currentLog]);
    }, actionDuration - (performance.now() - lastExecute));
    return () => clearTimeout(timer);
  }, [currentLog, log, damageUnit, lastExecute]);

  const augmentedClips = "exe";

  return (
    <div className="battle-log-container">
      <Caption text="Battle log" />
      <ListGroup flush augmented-ui={augmentedClips}>
        {currentLog.map((action, i) => (
          <BattleLogItem
            key={i}
            action={action}
            units={units}
            enemyUnits={enemyUnits}
          />
        ))}
        <div ref={lastElement} />
      </ListGroup>
    </div>
  );
};

export default BattleLog;
