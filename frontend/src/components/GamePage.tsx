import React from "react";
import { PlayerInfo } from "../models/game-state.model";
import { RootSchema } from "../store/root-schema";
import { connect } from "react-redux";
import Player from "./Player";
import GamePhaseSpecificCenter from "./GamePhaseSpecificCenter";
import { Col, Row } from "reactstrap";
import GamePhaseSpecificSidebar from "./GamePhaseSpecificSidebar";

interface Props {
  player: PlayerInfo;
  enemy: PlayerInfo;
}

const GamePage: React.FunctionComponent<Props> = ({ player, enemy }: Props) => {
  return (
    <div>
      <Row className="game-panel-row">
        <Col xs="3">
          <p>Elo</p>
        </Col>

        <Col xs="6">
          <div className="game-center-container">
            <Row>
              <Col className="h-flex-align-center">
                <Player {...enemy} isEnemy={true} />
              </Col>
            </Row>

            <Row>
              <Col className="h-flex-align-center">
                <GamePhaseSpecificCenter />
              </Col>
            </Row>

            <Row>
              <Col className="h-flex-align-center">
                <Player {...player} isEnemy={false} />
              </Col>
            </Row>
          </div>
        </Col>

        <Col xs="3">
          <GamePhaseSpecificSidebar />
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = ({ gameState }: RootSchema) => ({
  player: gameState!.player,
  enemy: gameState!.enemy,
});

export default connect(mapStateToProps)(GamePage);
