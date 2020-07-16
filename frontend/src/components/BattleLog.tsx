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

  const [visibleLength, setVisibleLength] = useState<number>(0);
  const lastElement = useRef<HTMLDivElement>(null);
  const [lastExecute, setLastExecute] = useState<number>(performance.now());

  useEffect(() => {
    if (visibleLength === log.length) return;
    const timer = setTimeout(() => {
      setLastExecute(performance.now());
      if (visibleLength === log.length) return;
      const nextAction = log[visibleLength];
      damageUnit({
        unitId: nextAction.whom,
        damage: nextAction.damage,
      });
      setVisibleLength(visibleLength + 1);
    }, actionDuration - (performance.now() - lastExecute));
    return () => clearTimeout(timer);
  }, [visibleLength, log, damageUnit, lastExecute]);

  useLayoutEffect(() => {
    lastElement.current?.scrollIntoView(false);
  }, [visibleLength, lastElement]);

  return (
    <div>
      <Caption text="Battle log"></Caption>
      <ListGroup flush>
        {log.map((action, i) => {
          const who = whos[i];
          const whom = whoms[i];
          if (!(who && whom)) return null;

          const positiveNews = units.indexOf(who) !== -1;
          return (
            <>
              <BattleLogItem
                key={`log-${i}`}
                visible={i >= visibleLength}
                action={action}
                who={who}
                whom={whom}
                positiveNews={positiveNews}
              />
              <Projectile
                key={`projectile-${i}`}
                delay={actionDuration * i}
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
