import React from "react";
import { useDrop } from "react-dnd";
import { Unit } from "../models/game-state.model";
import Caption from "./Caption";
import BackpackUnit from "./BackpackUnit";

export interface Props {
  units: Unit[];
  selectUnit: (unit: Unit) => void;
  selectedUnit?: Unit;
  unplaceUnit: (unitId: string) => void;
}

const Backpack: React.FunctionComponent<Props> = ({
  units,
  selectUnit,
  selectedUnit,
  unplaceUnit,
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

  return (
    <div className="backpack" ref={drop}>
      <div className={hovered ? "backpack-overlay" : ""}>
        <Caption text="Units" />
        <ul>
          {units.map(unit => (
            <li
              key={unit.id}
              className={unit.id === selectedUnit?.id ? "unit--selected" : "unit"}
              onClick={() => selectUnit(unit)}
            >
              <div className="unit-container">
                <BackpackUnit unit={unit} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Backpack;
