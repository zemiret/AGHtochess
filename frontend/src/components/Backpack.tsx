import React from "react";
import { useDrop } from "react-dnd";
import { Unit } from "../models/game-state.model";
import Caption from "./Caption";
import BackpackUnit from "./BackpackUnit";

export interface Props {
  units: Unit[];
  unplaceUnit: (unitId: string) => void;
  sellUnit: (unitId: string) => void;
}

const Backpack: React.FunctionComponent<Props> = ({
  units,
  unplaceUnit,
  sellUnit,
}: Props) => {
  const [{ hovered }, drop] = useDrop<
    { type: string; id: string },
    void,
    { hovered: boolean }
  >({
    accept: "boardUnit",
    drop: (item, _monitor) => {
      unplaceUnit(item.id);
    },
    collect: monitor => ({
      hovered: monitor.isOver(),
    }),
  });

  const augmentedClips = "exe tl-clip tr-clip bl-clip br-clip";

  return (
    <div className="backpack" ref={drop}>
      <div className={hovered ? "backpack-overlay" : ""}>
        <Caption text="Units" />
        <ul>
          {units.map(unit => (
            <li key={unit.id} className="unit" augmented-ui={augmentedClips}>
              <div className="unit-container">
                <BackpackUnit unit={unit} sellUnit={() => sellUnit(unit.id)} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Backpack;
