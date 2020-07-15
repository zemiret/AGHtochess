import React from "react";
import { Unit as UnitType } from "../models/game-state.model";
import UnitStat from "./UnitStat";
import { STAT_COLORS } from "../constants";

interface Props {
  unit: UnitType;
}

const UnitStats: React.FunctionComponent<Props> = ({ unit }: Props) => {
  return (
    <>
      <div className="unit-caption">
        <p>{unit.type}</p>
      </div>

      <UnitStat text="HP" value={Math.ceil(unit.hp)} color={STAT_COLORS.hp} />
      <UnitStat text="Attack" value={unit.attack} color={STAT_COLORS.attack} />
      <UnitStat text="Defense" value={unit.defense} color={STAT_COLORS.defense} />
      <UnitStat
        text="Magic resistance"
        value={unit.magicResist}
        color={STAT_COLORS.magicResist}
      />
      <UnitStat text="Range" value={unit.range} color={STAT_COLORS.range} />
      <UnitStat
        text="Critic chance"
        value={unit.criticalChance}
        color={STAT_COLORS.criticalChance}
      />
      <UnitStat text="Attack speed" value={unit.attackSpeed} />
    </>
  );
};

export default UnitStats;
