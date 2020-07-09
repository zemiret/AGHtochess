import React, { useState } from "react";
import { StoreGameState, UnitPlacement } from "../models/game-state.model";
import StoreUnit from "./StoreUnit";
import Unit from "./Unit";
import { Container, Row, Col } from "reactstrap";
import { BOARD_HEIGHT, BOARD_WIDTH } from "../constants";

interface Props extends StoreGameState {
  buyUnit: (unitId: string) => void;
  placeUnit: (unitsPlacement: UnitPlacement) => void;
}

const Store: React.FunctionComponent<Props> = ({
  store,
  units,
  unitsPlacement,
  buyUnit,
  placeUnit,
}: Props) => {
  const range = (n: number): number[] => {
    return Array.from(Array(n).keys());
  };
  const [selectedUnit, selectUnit] = useState<string>("");
  const board = range(BOARD_HEIGHT).map(_ => range(BOARD_WIDTH).map(_ => ""));
  unitsPlacement.forEach(up => {
    board[up.x][up.y] = up.unitId;
  });
  const placeSelected = (x: number, y: number) => {
    if (!board[x][y] && selectedUnit) {
      placeUnit({ unitId: selectedUnit, x, y });
    }
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
          <h2>My Units (click on unit to select)</h2>
          <ul>
            {units.map(unit => (
              <li
                key={unit.id}
                className={unit.id == selectedUnit ? "unit--selected" : "unit"}
                onClick={() => selectUnit(unit.id)}
              >
                <Unit unit={unit} />
              </li>
            ))}
          </ul>
        </Col>
      </Row>
      <Row>
        {unitsPlacement}
        <table className="board with-border">
          {range(BOARD_HEIGHT).map(x => (
            <tr key={x} className="with-border">
              {range(BOARD_WIDTH).map(y => (
                <td
                  key={x * BOARD_WIDTH + y}
                  className="board-cell with-border"
                  onClick={() => placeSelected(x, y)}
                >
                  {!board[x][y] ? `(${x},${y})` : board[x][y]}
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
