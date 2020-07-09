import React from "react";
import { Unit as UnitType } from "../models/game-state.model";

interface Props {
  unit: UnitType;
}

interface StatsMap {
  [key: string]: number;
}

const statMaxValues: StatsMap = {
  hp: 300,
  attack: 80,
  defense: 10,
  magicResist: 10,
  range: 10,
  criticalChance: 5,
  attackSpeed: 10,
};

const statsToDisplayInside: { [key: string]: Array<string> } = {
  attack: ["hsla(360, 100%, 50%, 1)", "hsla(360, 100%, 20%, 1)"],
  magicResist: ["hsla(240, 100%, 50%, 1)", "hsla(240, 100%, 20%, 1)"],
  range: ["hsla(120, 100%, 50%, 1)", "hsla(120, 100%, 20%, 1)"],
  attackSpeed: ["hsla(26, 100%, 50%, 1)", "hsla(26, 100%, 20%, 1)"],
};

const UnitAvatar: React.FunctionComponent<Props> = ({ unit }: Props) => {
  const defenseBorderWidth = Math.max(5, (unit.defense / statMaxValues.defense) * 15);
  const hpPercentage = unit.hp / statMaxValues.hp;

  const statsPercentages: StatsMap = {};
  const unitStats = unit as { [key: string]: any };
  const statsCount = Object.keys(statsToDisplayInside).length;
  for (const stat in statsToDisplayInside) {
    statsPercentages[stat] = unitStats[stat] / statMaxValues[stat] / statsCount;
  }

  let gradientPhases = "";
  let accumulatedFraction = 0;
  for (const [stat, fraction] of Object.entries(statsPercentages)) {
    const [color, colorStop] = statsToDisplayInside[stat];
    gradientPhases += `${color} ${accumulatedFraction *
      100}%, ${color} ${(accumulatedFraction + fraction) *
      100}%, ${colorStop} ${(accumulatedFraction + fraction + 0.01) *
      100}%, ${colorStop} ${(accumulatedFraction + 1 / statsCount) * 100}%,`;

    accumulatedFraction += 1 / statsCount;
  }
  gradientPhases = gradientPhases.substr(0, gradientPhases.length - 1);

  return (
    <div
      className="unit-avatar"
      style={{
        borderWidth: defenseBorderWidth + "px",
        backgroundImage: `conic-gradient(
              ${gradientPhases}
            ), 
            conic-gradient(red 0turn, red ${hpPercentage}turn, gray ${hpPercentage}turn, gray 1turn)`,
      }}
    ></div>
  );
};

export default UnitAvatar;
