import React from "react";
import { useDrag } from "react-dnd";
import { Unit as UnitType } from "../models/game-state.model";
import Unit from "./Unit";

interface Props {
  unit: UnitType;
}

const BackpackUnit: React.FunctionComponent<Props> = ({ unit }: Props) => {
  const drag = useDrag({
    item: {
      type: "backpackUnit",
      id: unit.id,
    },
  })[1];

  return <Unit unit={unit} dragRef={drag} />;
};

export default BackpackUnit;
