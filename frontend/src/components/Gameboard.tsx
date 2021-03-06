import React from "react";
import { CommonGameState, Unit, UnitPlacement } from "../models/game-state.model";
import { Container, Row } from "reactstrap";
import { BOARD_HEIGHT, BOARD_WIDTH } from "../constants";
import GameboardCell from "./GameboardCell";

interface Props extends CommonGameState {
  placeUnit?: (unitsPlacement: UnitPlacement) => void;
  units: Unit[];
}

const Gameboard: React.FunctionComponent<Props> = ({
  unitsPlacement,
  enemyUnitsPlacement,
  placeUnit,
  units,
}: Props) => {
  const range = (n: number): number[] => {
    return Array.from(Array(n).keys());
  };
  const board = range(BOARD_HEIGHT).map(_ => range(BOARD_WIDTH).map(_ => ""));
  unitsPlacement.concat(enemyUnitsPlacement).forEach(up => {
    board[up.x][up.y] = up.unitId;
  });

  const isEnemyCell = (y: number) => y < BOARD_HEIGHT / 2;

  return (
    <Container>
      <Row className="h-flex-align-center">
        <table className="board">
          <tbody>
            {range(BOARD_HEIGHT).map(y => (
              <tr key={y}>
                {range(BOARD_WIDTH).map(x => (
                  <GameboardCell
                    key={y * BOARD_WIDTH + x}
                    x={x}
                    y={y}
                    isEnemyCell={isEnemyCell(y)}
                    placeUnit={placeUnit}
                    unit={units.find(u => u.id === board[x][y])}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Row>
    </Container>
  );
};

export default Gameboard;
