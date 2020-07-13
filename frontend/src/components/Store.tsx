import React from "react";
import { StoreGameState } from "../models/game-state.model";
import StoreUnit from "./StoreUnit";
import Caption from "./Caption";

interface Props extends StoreGameState {
  buyUnit: (unitId: string) => void;
}

const Store: React.FunctionComponent<Props> = ({ store, buyUnit }: Props) => {
  return (
    <div className="store">
      <Caption text="Store" />
      <ul>
        {store.map(unit => (
          <li key={unit.id}>
            <div className="unit-container">
              <StoreUnit unit={unit} buyUnit={() => buyUnit(unit.id)} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Store;
