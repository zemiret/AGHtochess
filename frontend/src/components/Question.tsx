import React from "react";
import { Question as QuestionType } from "../models/game-state.model";
import {
  Card,
  CardText,
  CardBody,
  CardHeader,
  CardTitle,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

interface Props {
  answerQuestion: (answerId: number) => void;
  question: QuestionType;
}

const Question: React.FunctionComponent<Props> = ({
  question,
  answerQuestion,
}: Props) => {
  const augmentedClips = "exe tl-clip tr-clip bl-clip br-clip";
  return (
    <>
      {question.answers && (
        <Card className="question-card">
          <CardHeader>Question</CardHeader>
          <CardBody>
            <CardTitle>{question.text}</CardTitle>
            <CardText>
              <ListGroup>
                {question.answers.map(a => {
                  return (
                    <ListGroupItem
                      augmented-ui={augmentedClips}
                      key={a.id}
                      tag="button"
                      action
                      onClick={() => answerQuestion(a.id)}
                    >
                      {a.text}
                    </ListGroupItem>
                  );
                })}
              </ListGroup>
            </CardText>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default Question;
