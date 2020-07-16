import React, { useState } from "react";
import {
  QuestionDifficulty,
  StoreUnit as StoreUnitType,
} from "../models/game-state.model";
import Unit from "./Unit";
import { Button, ButtonGroup, Modal } from "reactstrap";
import { QUESTION_DIFFICULTY_MULTIPLIERS } from "../constants";
import Question from "./Question";
import BuyUnitTooltipButton from "./BuyUnitTooltipButton";

interface Props {
  storeUnit: StoreUnitType;
  buyUnit: () => void;
  buyUnitWithDiscount: (
    questionDifficulty: QuestionDifficulty,
    answerId: number,
  ) => void;
  playerMoney: number;
}

const StoreUnit: React.FunctionComponent<Props> = ({
  storeUnit,
  buyUnit,
  buyUnitWithDiscount,
  playerMoney,
}: Props) => {
  const difficulties = Object.keys(QuestionDifficulty);
  const prices = difficulties.reduce<{ [k: string]: number }>((acc, cur) => {
    acc[cur] = Math.ceil(
      storeUnit.unit.price * QUESTION_DIFFICULTY_MULTIPLIERS[cur as QuestionDifficulty],
    );
    return acc;
  }, {});

  const [modalOpen, setModalOpen] = useState(false);
  const [
    selectedDifficulty,
    setSelectedDifficulty,
  ] = useState<QuestionDifficulty | null>(null);

  const openQuestionModal = (questionDifficulty: QuestionDifficulty) => {
    setSelectedDifficulty(questionDifficulty);
    setModalOpen(true);
  };

  const [unitId] = useState(storeUnit.unit.id);

  return (
    <>
      <Unit unit={storeUnit.unit} />
      <span className="v-spacer-sm" />

      <div className="unit-action-row v-flex-align-center">
        <ButtonGroup>
          <Button
            color="primary"
            size="sm"
            onClick={buyUnit}
            disabled={playerMoney < storeUnit.unit.price}
          >
            {storeUnit.unit.price} €cts
          </Button>

          {difficulties.map(difficulty => (
            <BuyUnitTooltipButton
              key={difficulty}
              questionDifficulty={difficulty as QuestionDifficulty}
              price={prices[difficulty]}
              unitId={unitId}
              onClick={() => openQuestionModal(difficulty as QuestionDifficulty)}
              disabled={playerMoney < prices[difficulty]}
            />
          ))}
        </ButtonGroup>
      </div>

      <Modal isOpen={modalOpen}>
        {selectedDifficulty && storeUnit.questions[selectedDifficulty] && (
          <Question
            answerQuestion={answerId => {
              buyUnitWithDiscount(selectedDifficulty, answerId);
              setModalOpen(false);
            }}
            question={storeUnit.questions[selectedDifficulty]}
          />
        )}
      </Modal>
    </>
  );
};

export default StoreUnit;
