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
    <div>
      <Unit unit={unit} />
      <p>Price: {unit.price}</p>
      <Button onClick={buyUnit}>Buy</Button>
    </div>
  );
};

export default StoreUnit;
