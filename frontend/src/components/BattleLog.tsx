import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
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
      setCurrentLog([...currentLog, nextAction]);
    }, actionDuration - (performance.now() - lastExecute));
    return () => clearTimeout(timer);
  }, [currentLog, log, damageUnit, lastExecute]);

  useLayoutEffect(() => {
    lastElement.current?.scrollIntoView(false);
  }, [currentLog, lastElement]);

  return (
    <div>
      <Caption text="Battle log"></Caption>
      <ListGroup flush>
        {currentLog.map((action, i) => (
          <BattleLogItem
            key={i}
            action={action}
            units={units}
            enemyUnits={enemyUnits}
          />
        ))}
        <div ref={lastElement}></div>
      </ListGroup>
    </div>
  );
};

export default BattleLog;
