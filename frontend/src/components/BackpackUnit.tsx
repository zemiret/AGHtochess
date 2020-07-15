import React from "react";
import { useDrag } from "react-dnd";
import { Unit as UnitType } from "../models/game-state.model";
import Unit from "./Unit";
import { Button } from "reactstrap";

interface Props {
  unit: UnitType;
  sellUnit: () => void;
}

const BackpackUnit: React.FunctionComponent<Props> = ({ unit, sellUnit }: Props) => {
  const drag = useDrag({
    item: {
      type: "backpackUnit",
      id: unit.id,
    },
  })[1];

  return (
    <>
      <Unit unit={unit} dragRef={drag} />
      <span className="v-spacer-sm" />

      <div className="unit-action-row v-flex-align-center">
        <div>
          <span className="strong">{unit.price}</span> €cts
        </div>
        <Button outline color="primary" size="sm" onClick={sellUnit}>
          Sell
        </Button>
      </div>
    </>
  );
};

export default BackpackUnit;
