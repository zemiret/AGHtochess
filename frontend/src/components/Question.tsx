import React from "react";
import { Question as QuestionType } from "../models/game-state.model";
import {
  Card,
  CardText,
  CardBody,
  CardHeader,
  CardTitle,
  Button,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

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
    <Card>
      <CardHeader>
        Question
      </CardHeader>
      <CardBody>
        <CardTitle>{text}</CardTitle>
        <CardText>
          <ListGroup>
            {answers.map(a => {
              return (
                <ListGroupItem
                  key={a.id}
                  tag="button"
                  action
                  onClick={() => answerQuestion(questionId, a.id)}
                >
                  {a.text}
                </ListGroupItem>
              );
            })}
          </ListGroup>
        </CardText>
      </CardBody>
    </Card>
  );
};

export default Question;
