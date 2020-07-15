import React, { useState } from "react";
import { QuestionDifficulty } from "../models/game-state.model";
import { Button, Tooltip } from "reactstrap";

interface Props {
  questionDifficulty: QuestionDifficulty;
  price: number;
  unitId: string;
  onClick: React.MouseEventHandler<never>;
  disabled?: boolean;
}

const BuyUnitTooltipButton: React.FunctionComponent<Props> = ({
  questionDifficulty,
  price,
  unitId,
  onClick,
  disabled,
}: Props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <>
      <Tooltip
        placement="top"
        isOpen={tooltipOpen && !disabled}
        target={`Buy-${unitId}-${questionDifficulty}`}
        toggle={toggle}
      >
        Question difficulty: {questionDifficulty}
      </Tooltip>
      <Button
        disabled={disabled}
        id={`Buy-${unitId}-${questionDifficulty}`}
        outline
        color="primary"
        size="sm"
        onClick={onClick}
      >
        {price} €cts
      </Button>
    </>
  );
};

export default BuyUnitTooltipButton;
