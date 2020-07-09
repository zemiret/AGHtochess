import React from "react";
import { StoreGameState, Unit, UnitPlacement } from "../models/game-state.model";
import { Container, Row } from "reactstrap";
import { BOARD_HEIGHT, BOARD_WIDTH } from "../constants";
import BoardUnit from "./BoardUnit";

interface Props extends StoreGameState {
  placeUnit: (unitsPlacement: UnitPlacement) => void;
  unplaceUnit: (unitId: string) => void;
  selectedUnit?: Unit;
  units: Unit[];
}

const Gameboard: React.FunctionComponent<Props> = ({
  unitsPlacement,
  placeUnit,
  unplaceUnit,
  selectedUnit,
  units,
}: Props) => {
  const range = (n: number): number[] => {
    return Array.from(Array(n).keys());
  };
  const board = range(BOARD_HEIGHT).map(_ => range(BOARD_WIDTH).map(_ => ""));
  unitsPlacement.forEach(up => {
    board[up.x][up.y] = up.unitId;
  });

  const toggleSelected = (x: number, y: number) => {
    if (y < BOARD_HEIGHT / 2) {
      // Do not allow placing units not on our half
      return;
    }

    if (selectedUnit && board[x][y] !== selectedUnit.id) {
      placeUnit({ unitId: selectedUnit.id, x, y });
    } else if (board[x][y]) {
      unplaceUnit(board[x][y]);
    }
  };
  return (
    <Container>
      <Row className="h-flex-align-center">
        <table className="board with-border">
          {range(BOARD_HEIGHT).map(y => (
            <tr key={y} className="with-border">
              {range(BOARD_WIDTH).map(x => (
                <td
                  key={y * BOARD_WIDTH + x}
                  className="board-cell with-border"
                  onClick={() => toggleSelected(x, y)}
                >
                  {!board[x][y] ? (
                    <Container />
                  ) : (
                    <BoardUnit
                      unit={units.find(u => u.id === board[x][y]) || units[0]}
                    />
                  )}
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
