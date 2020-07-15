import React from "react";
import { Unit as UnitType } from "../models/game-state.model";
import { Col, Container, Row } from "reactstrap";
import UnitAvatar from "./UnitAvatar";
import UnitStats from "./UnitStats";
import { DragElementWrapper, DragSourceOptions } from "react-dnd";

interface Props {
  unit: UnitType;
  dragRef?: DragElementWrapper<DragSourceOptions>;
}

const Unit: React.FunctionComponent<Props> = ({ unit, dragRef }: Props) => {
  return (
    <Container>
      <Row>
        <Col xs="5" className="v-flex-align-center">
          <UnitAvatar unit={unit} dragRef={dragRef} />
        </Col>

        <Col xs="7">
          <UnitStats unit={unit} />
        </Col>
      </Row>
    </Container>
  );
};

export default Unit;
