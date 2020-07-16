import React from "react";
import { QuestionDifficulty, StoreGameState } from "../models/game-state.model";
import StoreUnit from "./StoreUnit";
import Caption from "./Caption";

interface Props extends StoreGameState {
  buyUnit: (unitId: string) => void;
  buyUnitWithDiscount: (
    unitId: string,
    questionDifficulty: QuestionDifficulty,
    answerId: number,
  ) => void;
  playerMoney: number;
}

const Store: React.FunctionComponent<Props> = ({
  store,
  buyUnit,
  buyUnitWithDiscount,
  playerMoney,
}: Props) => {
  const augmentedClips = "exe tl-clip tr-clip bl-clip br-clip";

  return (
    <div className="store">
      <Caption text="Store" />
      <ul>
        {store.map(storeUnit => (
          <li key={storeUnit.unit.id}>
            <div className="unit-container" augmented-ui={augmentedClips}>
              <StoreUnit
                playerMoney={playerMoney}
                storeUnit={storeUnit}
                buyUnit={() => buyUnit(storeUnit.unit.id)}
                buyUnitWithDiscount={(questionDifficulty, answerId) =>
                  buyUnitWithDiscount(storeUnit.unit.id, questionDifficulty, answerId)
                }
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Store;
