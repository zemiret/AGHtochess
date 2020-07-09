import React from "react";
import { Question as QuestionType } from "../models/game-state.model";

interface Props extends QuestionType {
  answerQuestion: (q: number, a: number) => void;
}

const Question: React.FunctionComponent<Props> = ({
  id: questionId,
  text,
  answers,
  answerQuestion,
}: Props) => {
  return (
    <div>
      {answers && (
        <div>
          <h2>Question</h2>
          <h3>{text}</h3>
          <ul>
            {answers.map(a => {
              return (
                <li key={a.id}>
                  <button onClick={() => answerQuestion(questionId, a.id)}>
                    {a.text}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {!answers && "No more questions"}
    </div>
  );
};

export default Question;
