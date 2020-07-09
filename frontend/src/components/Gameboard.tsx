import React from "react";
import { StoreGameState, Unit, UnitPlacement } from "../models/game-state.model";
import { Container, Row } from "reactstrap";
import { BOARD_HEIGHT, BOARD_WIDTH } from "../constants";

interface Props extends StoreGameState {
  placeUnit: (unitsPlacement: UnitPlacement) => void;
  selectedUnit: Unit | null;
}

const Gameboard: React.FunctionComponent<Props> = ({
  unitsPlacement,
  placeUnit,
  selectedUnit,
}: Props) => {
  const range = (n: number): number[] => {
    return Array.from(Array(n).keys());
  };
  const board = range(BOARD_HEIGHT).map(_ => range(BOARD_WIDTH).map(_ => ""));
  unitsPlacement.forEach(up => {
    board[up.x][up.y] = up.unitId;
  });
  const placeSelected = (x: number, y: number) => {
    if (!board[x][y] && selectedUnit) {
      placeUnit({ unitId: selectedUnit.id, x, y });
    }
  };
  return (
    <Container>
      <Row>
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

export default Gameboard;
