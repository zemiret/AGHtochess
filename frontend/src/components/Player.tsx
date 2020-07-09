import React from "react";
import { PlayerInfo } from "../models/game-state.model";
import RoundIcon from "./RoundIcon";
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Container,
  Progress,
  Row,
} from "reactstrap";

import { MAX_PLAYER_HP } from "../constants";

export interface PlayerInfoDisplay extends PlayerInfo {
  isEnemy: boolean;
}

const Player: React.FunctionComponent<PlayerInfoDisplay> = ({
  username,
  hp,
  money,
  isEnemy,
}: PlayerInfoDisplay) => {
  const progressColor = isEnemy ? "danger" : "success";
  const progressState = (hp / MAX_PLAYER_HP) * 100;

  return (
    <Card className="player-card">
      <CardBody>
        <Container>
          <Row className="v-flex-align-center">
            <Col xs="auto">
              <RoundIcon />
            </Col>
            <Col xs="4">
              <CardTitle className="player-username">{username}</CardTitle>
            </Col>
          </Row>

          <Row className="next-player-row v-flex-align-center">
            <Col xs={isEnemy ? "12" : "10"}>
              <Progress color={progressColor} value={progressState}>
                {hp}/{MAX_PLAYER_HP}
              </Progress>
            </Col>

            {!isEnemy && (
              <Col xs="2">
                <CardText>
                  <span className="strong">{money}</span> €cts
                </CardText>
              </Col>
            )}
          </Row>
        </Container>
      </CardBody>
    </Card>
  );
};

export default Player;
