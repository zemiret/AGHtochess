import React from "react";
import { Unit as UnitType } from "../models/game-state.model";
import { Col, Container, Row } from "reactstrap";
import PopoverUnitAvatar from "./PopoverUnitAvatar";
import { useDrag } from "react-dnd";

interface Props {
  unit: UnitType;
  draggable: boolean;
}

const BoardUnit: React.FunctionComponent<Props> = ({ unit, draggable }: Props) => {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: "boardUnit",
      id: unit.id,
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <Container>
      <Row>
        <Col className="v-flex-align-center">
          <PopoverUnitAvatar
            dragRef={draggable ? drag : undefined}
            isDragging={isDragging}
            size={58}
            unit={unit}
            shouldDisappear={true}
            showPrice={true}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default BoardUnit;
