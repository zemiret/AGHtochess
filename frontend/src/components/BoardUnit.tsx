import React, { useState } from "react";
import { Unit as UnitType } from "../models/game-state.model";
import { Col, Container, Popover, PopoverBody, Row } from "reactstrap";
import UnitAvatar from "./UnitAvatar";
import UnitStats from "./UnitStats";

interface Props {
  unit: UnitType;
}

const BoardUnit: React.FunctionComponent<Props> = ({ unit }: Props) => {
  const [hover, setHover] = useState<boolean>(false);
  const [unitId] = useState<string>(unit.id);

  return (
    <Container>
      <Row>
        <Col
          className="v-flex-align-center"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div id={`unit-${unitId}`}>
            <UnitAvatar unit={unit} />
          </div>
          <Popover
            placement="left"
            isOpen={hover}
            trigger="hover"
            target={`unit-${unitId}`}
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
