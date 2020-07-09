import React from "react";
import { Unit } from "../models/game-state.model";
import Caption from "./Caption";
import UnitCmp from "./Unit";

export interface Props {
  units: Unit[];
}

const Backpack: React.FunctionComponent<Props> = ({ units }: Props) => {
  return (
    <div>
      <Caption text="Units" />
      <ul>
        {units.map(unit => (
          <li key={unit.id}>
            <div className="unit-container">
              <UnitCmp unit={unit} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Backpack;
