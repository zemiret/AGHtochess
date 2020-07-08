import React from "react";
import { PlayerInfo } from "../models/game-state.model";
import { RootSchema } from "../store/root-schema";
import { connect } from "react-redux";
import Player from "./Player";
import GamePhaseSpecific from "./GamePhaseSpecific";
import { Col, Container, Row } from "reactstrap";

interface Props {
  player: PlayerInfo;
  enemy: PlayerInfo;
}

const GamePage: React.FunctionComponent<Props> = ({ player, enemy }: Props) => {
  return (
    <Container className="game-phase-container">
      <Row>
        <Col className="h-flex-align-center">
          <Player {...enemy} isEnemy={true} />
        </Col>
      </Row>

      <Row>
        <Col className="h-flex-align-center">
          <GamePhaseSpecific />
        </Col>
      </Row>

      <Row>
        <Col className="h-flex-align-center">
          <Player {...player} isEnemy={false} />
        </Col>
      </Row>
    </Container>
  );
};

const mapStateToProps = ({ gameState }: RootSchema) => ({
  player: gameState!.player,
  enemy: gameState!.enemy,
});

export default connect(mapStateToProps)(GamePage);
