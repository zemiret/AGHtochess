import React from "react";
import { Unit as UnitType } from "../models/game-state.model";
import { Col, Container, Row } from "reactstrap";
import PopoverUnitAvatar from "./PopoverUnitAvatar";

interface Props {
  unit: UnitType;
}

const BoardUnit: React.FunctionComponent<Props> = ({ unit }: Props) => {
  return (
    <Container>
      <Row>
        <Col className="v-flex-align-center">
          <PopoverUnitAvatar size={58} unit={unit} />
        </Col>
      </Row>
    </Container>
  );
};

export default BoardUnit;
