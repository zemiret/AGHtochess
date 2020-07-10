import React from "react";
import { Unit as UnitType } from "../models/game-state.model";
import UnitStat from "./UnitStat";

interface Props {
  unit: UnitType;
}

const UnitStats: React.FunctionComponent<Props> = ({ unit }: Props) => {
  return (
    <>
      <div className="unit-caption">
        <p>{unit.type}</p>
      </div>

      <UnitStat text="HP" value={unit.hp} />
      <UnitStat text="Attack" value={unit.attack} />
      <UnitStat text="Defense" value={unit.defense} />
      <UnitStat text="Magic resistance" value={unit.magicResist} />
      <UnitStat text="Range" value={unit.range} />
      <UnitStat text="Critic chance" value={unit.criticalChance} />
      <UnitStat text="Attack speed" value={unit.attackSpeed} />
    </>
  );
};

export default UnitStats;
