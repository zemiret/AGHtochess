import React, { useState } from "react";
import { Unit as UnitType } from "../models/game-state.model";
import { Col, Container, Row } from "reactstrap";
import UnitAvatar from "./UnitAvatar";
import { Popover, PopoverBody } from "reactstrap";
import UnitStats from "./UnitStats";

interface Props {
  unit: UnitType;
}

const BoardUnit: React.FunctionComponent<Props> = ({ unit }: Props) => {
  const [hover, setHover] = useState<boolean>(false);

  return (
    <Container>
      <Row>
        <Col
          className="v-flex-align-center"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div id={`unit-${unit.id}`}>
            <UnitAvatar unit={unit} />
          </div>
          <Popover
            placement="left"
            isOpen={hover}
            target={`unit-${unit.id}`}
            onClick={() => {
              return;
            }}
          >
            <PopoverBody>
              <UnitStats unit={unit} />
            </PopoverBody>
          </Popover>
        </Col>
      </Row>
    </Container>
  );
};

export default BoardUnit;
