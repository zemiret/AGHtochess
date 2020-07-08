import React from "react";
import { Unit as UnitType } from "../models/game-state.model";

interface Props {
  unit: UnitType;
}

const Unit: React.FunctionComponent<Props> = ({ unit }: Props) => {
  return (
    <div>
      <h5>ID: {unit.id}</h5>
      <p>HP: {unit.hp}</p>
    </div>
  );
};

export default Unit;
