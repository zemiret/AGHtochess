import React, { useState } from "react";
import { Unit as UnitType } from "../models/game-state.model";
import UnitAvatar from "./UnitAvatar";
import { Popover, PopoverBody } from "reactstrap";
import UnitStats from "./UnitStats";

interface Props {
  unit: UnitType;
  size?: number;
}

const PopoverUnitAvatar: React.FunctionComponent<Props> = ({ unit, size }: Props) => {
  const [hover, setHover] = useState<boolean>(false);
  const [randomValue] = useState<string>(
    Math.random()
      .toString()
      .replace(".", ""),
  );

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-block",
      }}
    >
      <div id={`unit-${unit.id}-${randomValue}`}>
        <UnitAvatar unit={unit} size={size} />
      </div>
      <Popover
        placement="left"
        isOpen={hover}
        target={`unit-${unit.id}-${randomValue}`}
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
