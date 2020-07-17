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
  isDragging?: boolean;
  shouldDisappear?: boolean;
  showPrice?: boolean;
}

const PopoverUnitAvatar: React.FunctionComponent<Props> = ({
  unit,
  size,
  dragRef,
  isDragging,
  shouldDisappear,
  showPrice,
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
        <UnitAvatar
          unit={unit}
          size={size}
          shouldDisappear={shouldDisappear}
          dragRef={dragRef}
        />
      </div>
      <Popover
        className="unit-popover"
        placement="left"
        isOpen={!isDragging && hover}
        trigger="hover"
        target={`unit-${unitId}-${randomValue}`}
        onClick={() => {
          return;
        }}
      >
        <PopoverBody>
          <UnitStats unit={unit} showPrice={showPrice} />
        </PopoverBody>
      </Popover>
    </div>
  );
};

export default PopoverUnitAvatar;
