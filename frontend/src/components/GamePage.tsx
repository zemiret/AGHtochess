import React from "react";
import { PlayerInfo, Unit } from "../models/game-state.model";
import { RootSchema } from "../store/root-schema";
import { connect } from "react-redux";
import Player from "./Player";
import Timer from "./Timer";
import GamePhaseSpecificCenter from "./GamePhaseSpecificCenter";
import { Col, Row } from "reactstrap";
import GamePhaseSpecificSidebar from "./GamePhaseSpecificSidebar";
import Backpack from "./Backpack";

interface Props {
  player: PlayerInfo;
  enemy: PlayerInfo;
  phase: string;
  round: number;
  phaseEndsAt: number;
  units: Unit[];
}

const GamePage: React.FunctionComponent<Props> = ({
  player,
  enemy,
  units,
  phase,
  round,
  phaseEndsAt,
}: Props) => {
  return (
    <Row className="game-panel-row">
      <Col className="sidebar" xs="3">
        <Backpack units={units} />
      </Col>

      <Col xs="6">
        <div className="game-center-container">
          <Row>
            <Col className="h-flex-align-center top-bar">
              <Player {...enemy} isEnemy={true} />
              <Timer phase={phase} phaseEndsAt={phaseEndsAt} round={round} />
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

      <Col className="sidebar" xs="3">
        <GamePhaseSpecificSidebar />
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ gameState }: RootSchema) => ({
  player: gameState!.player,
  enemy: gameState!.enemy,
  phase: gameState!.phase,
  round: gameState!.round,
  phaseEndsAt: gameState!.phaseEndsAt,
  units: gameState!.units,
});

export default connect(mapStateToProps)(GamePage);
