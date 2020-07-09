import React from "react";
import { Unit as UnitType } from "../models/game-state.model";
import { Col, Container, Row } from "reactstrap";
import UnitStat from "./UnitStat";
import RoundIcon from "./RoundIcon";

interface Props {
  unit: UnitType;
}

const Unit: React.FunctionComponent<Props> = ({ unit }: Props) => {
  return (
    <Container>
      <Row>
        <Col xs="4" className="v-flex-align-center">
          <RoundIcon />
        </Col>

        <Col xs="8">
          <div className="unit-caption">
            <p>{unit.type}</p>
          </div>

          <UnitStat text="HP" value={unit.hp} />
          <UnitStat text="Attack" value={unit.attack} />
          <UnitStat text="Defense" value={unit.defense} />
          <UnitStat text="Magic resistance" value={unit.magicResist} />
          <UnitStat text="Range" value={unit.range} />
          <UnitStat text="Critic chance" value={unit.criticalChance} />
          <UnitStat text="Attack speed" value={unit.attackSpeed} />
        </Col>
      </Row>
    </Container>
  );
};

export default Unit;
