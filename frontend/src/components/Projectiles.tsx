import React from "react";
import { BattleAction } from "../models/game-state.model";
import Projectile from "./Projectile";

interface Props {
  log: BattleAction[];
  unitIds: string[];
}

const actionDuration = 200;

const Projectiles: React.FunctionComponent<Props> = ({ log, unitIds }: Props) => {
  const unitIdSet = new Set([...unitIds]);

  return (
    <>
      {log.map(({ who, whom }, i) => {
        if (!(who && whom)) return null;

        const positiveNews = unitIdSet.has(who);
        return (
          <Projectile
            key={i}
            delay={actionDuration * i}
            duration={actionDuration}
            source={who}
            target={whom}
            positiveNews={positiveNews}
          />
        );
      })}
    </>
  );
};

export default Projectiles;
