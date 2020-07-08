import React from "react";
import { StoreGameState } from "../models/game-state.model";

interface Props extends StoreGameState {
  buyUnit: (unitId: number) => void;
}

const Store: React.FunctionComponent<Props> = (props: Props) => {
  return <h1>Store ({props.store.length} items)</h1>;
};

export default Store;
