import React from "react";
import { StoreGameState } from "../models/game-state.model";
import StoreUnit from "./StoreUnit";

interface Props extends StoreGameState {
  buyUnit: (unitId: string) => void;
}

const Store: React.FunctionComponent<Props> = ({ store, buyUnit }: Props) => {
  return (
    <div>
      <h1>Store</h1>
      <ul>
        {store.map(unit => (
          <li key={unit.id}>
            <StoreUnit unit={unit} buyUnit={() => buyUnit(unit.id)} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Store;
