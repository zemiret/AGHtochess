import React from "react";
import { Unit } from "../models/game-state.model";
import Caption from "./Caption";
import BackpackUnit from "./BackpackUnit";

export interface Props {
  units: Unit[];
  selectUnit: (unit: Unit) => void;
  selectedUnit?: Unit;
}

const Backpack: React.FunctionComponent<Props> = ({
  units,
  selectUnit,
  selectedUnit,
}: Props) => {
  return (
    <div>
      <Caption text="Units" />
      <ul>
        {units.map(unit => (
          <li
            key={unit.id}
            className={unit.id === selectedUnit?.id ? "unit--selected" : "unit"}
            onClick={() => selectUnit(unit)}
          >
            <div className="unit-container">
              <BackpackUnit unit={unit} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Backpack;
