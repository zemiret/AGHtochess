import React, { useState } from "react";
import { Unit as UnitType } from "../models/game-state.model";
import UnitAvatar from "./UnitAvatar";
import { Popover, PopoverBody } from "reactstrap";
import UnitStats from "./UnitStats";
import { DragElementWrapper, DragSourceOptions } from "react-dnd";

interface Props {
  unit: UnitType;
  size?: number;
  dragRef?: DragElementWrapper<DragSourceOptions>;
}

const PopoverUnitAvatar: React.FunctionComponent<Props> = ({
  unit,
  size,
  dragRef,
}: Props) => {
  const [hover, setHover] = useState<boolean>(false);
  const [randomValue] = useState<string>(
    Math.random()
      .toString()
      .replace(".", ""),
  );
  const [unitId] = useState<string>(unit.id);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-block",
      }}
    >
      <div id={`unit-${unitId}-${randomValue}`}>
        <UnitAvatar unit={unit} size={size} dragRef={dragRef} />
      </div>
      <Popover
        placement="left"
        isOpen={hover}
        trigger="hover"
        target={`unit-${unitId}-${randomValue}`}
        onClick={() => {
          return;
        }}
      >
        <PopoverBody>
          <UnitStats unit={unit} />
        </PopoverBody>
      </Popover>
    </div>
  );
};

export default PopoverUnitAvatar;
