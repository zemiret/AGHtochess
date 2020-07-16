import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import { BattleAction, Unit } from "../models/game-state.model";
import { DamageUnit } from "../models/damage-unit.model";
import BattleLogItem from "./BattleLogItem";
import { ListGroup } from "reactstrap";
import Caption from "./Caption";
import Projectile from "./Projectile";

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
  const allUnits = [...units, ...enemyUnits];
  const whos = log.map(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    action => allUnits.find(unit => unit.id === action.who)!,
  );
  const whoms = log.map(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    action => allUnits.find(unit => unit.id === action.whom)!,
  );

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
        {currentLog.map((action, i) => {
          const who = whos[i];
          const whom = whoms[i];
          if (!(who && whom)) return null;

          const positiveNews = units.indexOf(who) !== -1;
          return (
            <>
              <BattleLogItem
                key={`log-${i}`}
                action={action}
                who={who}
                whom={whom}
                positiveNews={positiveNews}
              />
              <Projectile
                key={`projectile-${i}`}
                duration={actionDuration}
                source={who.id}
                target={whom.id}
                positiveNews={positiveNews}
              />
            </>
          );
        })}
        <div ref={lastElement}></div>
      </ListGroup>
    </div>
  );
};

export default BattleLog;
