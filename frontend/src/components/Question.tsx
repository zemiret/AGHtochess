import React from "react";
import { Question as QuestionType } from "../models/game-state.model";

type Props = QuestionType;

const Question: React.FunctionComponent<Props> = (question: Props) => {
  return (
    <div>
      <h2>Question</h2>
      <h3>{question.text}</h3>
      <ul>
        {question.answers.map(a => {
          return (
            <li key={a.id}>
              <button>{a.text}</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Question;
