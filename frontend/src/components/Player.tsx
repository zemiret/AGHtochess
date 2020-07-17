import React from "react";
import { PlayerInfo } from "../models/game-state.model";
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

  const augmentedClips = isEnemy ? "b-clip-x exe" : "t-clip-x exe";
  const additionalClass = isEnemy ? "enemy-card" : "";

  return (
    <Card className={`player-card ${additionalClass}`} augmented-ui={augmentedClips}>
      <CardBody>
        <Container>
          <Row className="h-flex-align-center">
            <CardTitle className="player-username">{username}</CardTitle>
          </Row>

          <Row className="next-player-row v-flex-align-center">
            <Col xs={isEnemy ? "12" : "10"}>
              <Progress color={progressColor} value={Math.max(0, progressState)}>
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
