import React from "react";
import { Unit as UnitType } from "../models/game-state.model";
import { Col, Container, Row } from "reactstrap";
import UnitAvatar from "./UnitAvatar";
import UnitStats from "./UnitStats";

interface Props {
  unit: UnitType;
}

const Unit: React.FunctionComponent<Props> = ({ unit }: Props) => {
  return (
    <Container>
      <Row>
        <Col xs="5" className="v-flex-align-center">
          <UnitAvatar unit={unit} />
        </Col>

        <Col xs="7">
          <UnitStats unit={unit} />
        </Col>
      </Row>
    </Container>
  );
};

export default Unit;
