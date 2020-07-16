import React from "react";
import { Unit as UnitType } from "../models/game-state.model";
import { DragElementWrapper, DragSourceOptions } from "react-dnd";
import { STAT_COLORS } from "../constants";

interface Props {
  unit: UnitType;
  size?: number;
  dragRef?: DragElementWrapper<DragSourceOptions>;
  shouldDisappear?: boolean;
}

interface StatsMap {
  [key: string]: number;
}

const statMaxValues: StatsMap = {
  hp: 500,
  attack: 150,
  defense: 150,
  magicResist: 100,
  range: 10,
  criticalChance: 100,
  attackSpeed: 16,
};

const colorStop = "#555";
const statsToDisplay = ["attack", "magicResist", "range", "criticalChance"];

const defaultSize = 90;

const UnitAvatar: React.FunctionComponent<Props> = ({
  unit,
  size,
  shouldDisappear,
  dragRef,
}: Props) => {
  const dimensions = !!size ? size : defaultSize;
  const defenseBorderWidth = Math.min(
    (Math.max(5, (unit.defense / statMaxValues.defense) * 15) * dimensions) /
      defaultSize,
    20,
  );
  const hpPercentage = Math.min(unit.hp / statMaxValues.hp, 1);

  const statsPercentages: StatsMap = {};
  const unitStats = unit as { [key: string]: any };
  const statsCount = Object.keys(statsToDisplay).length;
  for (const stat of statsToDisplay) {
    statsPercentages[stat] =
      Math.min(unitStats[stat], statMaxValues[stat]) / statMaxValues[stat] / statsCount;
  }

  let gradientPhases = "";
  let accumulatedFraction = 0;
  for (const [stat, fraction] of Object.entries(statsPercentages)) {
    const color = STAT_COLORS[stat];
    gradientPhases += `${color} ${accumulatedFraction *
      100}%, ${color} ${(accumulatedFraction + fraction) *
      100}%, ${colorStop} ${(accumulatedFraction + fraction + 0.01) *
      100}%, ${colorStop} ${(accumulatedFraction + 1 / statsCount) * 100}%,`;

    accumulatedFraction += 1 / statsCount;
  }
  gradientPhases = gradientPhases.substr(0, gradientPhases.length - 1);

  return (
    <div
      className={"unit-avatar" + (dragRef ? " unit-avatar-draggable" : "")}
      style={{
        borderWidth: defenseBorderWidth + "px",
        backgroundImage: `conic-gradient(
              ${gradientPhases}
            ), 
            conic-gradient(${STAT_COLORS.hp} 0turn, ${STAT_COLORS.hp} ${hpPercentage}turn, gray ${hpPercentage}turn, gray 1turn)`,
        width: `${dimensions}px`,
        height: `${dimensions}px`,
        opacity: !shouldDisappear || unit.hp > 0 ? 1 : 0,
      }}
      ref={dragRef}
    />
  );
};

export default UnitAvatar;
