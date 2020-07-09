import React from "react";
import { StoreGameState } from "../models/game-state.model";
import StoreUnit from "./StoreUnit";
import Unit from "./Unit";
import { Container, Row, Col } from "reactstrap";
import { BOARD_HEIGHT, BOARD_WIDTH } from "../constants";

interface Props extends StoreGameState {
  buyUnit: (unitId: string) => void;
}

const Store: React.FunctionComponent<Props> = ({ store, units, buyUnit }: Props) => {
  const range = (n: number): number[] => {
    return Array.from(Array(n).keys());
  };
  return (
    <Container>
      <Row>
        <Col>
          <h1>Prepare</h1>
          <h2>Store</h2>
          <ul>
            {store.map(unit => (
              <li key={unit.id}>
                <StoreUnit unit={unit} buyUnit={() => buyUnit(unit.id)} />
              </li>
            ))}
          </ul>
        </Col>
        <Col>
          <h2>My Units</h2>
          <ul>
            {units.map(unit => (
              <li key={unit.id}>
                <Unit unit={unit} />
              </li>
            ))}
          </ul>
        </Col>
      </Row>
      <Row>
        <table className="board with-border">
          {range(BOARD_HEIGHT).map(x => (
            <tr key={x} className="with-border">
              {range(BOARD_WIDTH).map(y => (
                <td key={x * BOARD_WIDTH + y} className="board-cell with-border">
                  {x} {y}
                </td>
              ))}
            </tr>
          ))}
        </table>
      </Row>
    </Container>
  );
};

export default Store;
