import React from "react";
import { useDrop } from "react-dnd";
import { Unit, UnitPlacement } from "../models/game-state.model";
import BoardUnit from "./BoardUnit";
import { Container } from "reactstrap";

interface Props {
  unit?: Unit;
  isEnemyCell: boolean;
  x: number;
  y: number;
  placeUnit?: (unitsPlacement: UnitPlacement) => void;
}

const GameboardCell: React.FunctionComponent<Props> = ({
  unit,
  isEnemyCell,
  x,
  y,
  placeUnit,
}: Props) => {
  const [{ hovered }, drop] = useDrop<
    { type: string; id: string },
    void,
    { hovered: boolean }
  >({
    accept: ["backpackUnit", "boardUnit"],
    drop: (item, _monitor) => {
      if (isEnemyCell) return;

      if (placeUnit) {
        placeUnit({ unitId: item.id, x, y });
      }
    },
    collect: monitor => ({
      hovered: !isEnemyCell && monitor.isOver(),
    }),
  });

  return (
    <td
      ref={drop}
      className={
        "board-cell with-border " +
        (isEnemyCell ? "enemy-board-cell" : "") +
        (hovered ? "board-cell-hovered" : "")
      }
    >
      {unit ? <BoardUnit unit={unit} draggable={!isEnemyCell} /> : <Container />}
    </td>
  );
};

export default GameboardCell;
