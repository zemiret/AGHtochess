import React from "react";
import { Unit as UnitType } from "../models/game-state.model";
import { Col, Container, Row } from "reactstrap";
import PopoverUnitAvatar from "./PopoverUnitAvatar";
import { useDrag } from "react-dnd";

interface Props {
  unit: UnitType;
}

const BoardUnit: React.FunctionComponent<Props> = ({ unit }: Props) => {
  const drag = useDrag({
    item: {
      type: "boardUnit",
      id: unit.id,
    },
  })[1];

  return (
    <Container>
      <Row>
        <Col className="v-flex-align-center">
          <PopoverUnitAvatar dragRef={drag} size={58} unit={unit} />
        </Col>
      </Row>
    </Container>
  );
};

export default BoardUnit;
