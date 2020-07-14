import React from "react";
import { Unit as UnitType } from "../models/game-state.model";
import Unit from "./Unit";
import { Button } from "reactstrap";

interface Props {
  unit: UnitType;
  buyUnit: () => void;
}

const StoreUnit: React.FunctionComponent<Props> = ({ unit, buyUnit }: Props) => {
  return (
    <>
      <Unit unit={unit} />
      <span className="v-spacer-sm" />

      <div className="unit-action-row v-flex-align-center">
        <div>
          <span className="strong">{unit.price}</span> €cts
        </div>
        <Button outline color="primary" size="sm" onClick={buyUnit}>
          Buy
        </Button>
      </div>
    </>
  );
};

export default StoreUnit;
