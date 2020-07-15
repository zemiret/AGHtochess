import React from "react";
import { PlayerInfo, Unit, UnitPlacement } from "../models/game-state.model";
import { RootSchema } from "../store/root-schema";
import { connect } from "react-redux";
import Player from "./Player";
import Timer from "./Timer";
import GamePhaseSpecificCenter from "./GamePhaseSpecificCenter";
import { Col, Row } from "reactstrap";
import GamePhaseSpecificSidebar from "./GamePhaseSpecificSidebar";
import Backpack from "./Backpack";
import { Dispatch } from "../store";
import { sellUnit, unplaceUnit } from "../store/actions";
import WaitingForPlayer from "./WaitingForPlayer";

interface Props {
  player: PlayerInfo;
  enemy?: PlayerInfo;
  phase: string;
  round: number;
  phaseEndsAt: number;
  units: Unit[];
  unitsPlacement: UnitPlacement[];
  dispatch: Dispatch;
}

const GamePage: React.FunctionComponent<Props> = ({
  player,
  enemy,
  units,
  unitsPlacement,
  phase,
  round,
  phaseEndsAt,
  dispatch,
}: Props) => {
  const placedUnitIds = unitsPlacement.map(u => u.unitId);
  return (
    <Row className="game-panel-row">
      <Col className="sidebar" xs="3">
        <Backpack
          units={units.filter(unit => placedUnitIds.indexOf(unit.id) === -1)}
          unplaceUnit={(unitId: string) => dispatch(unplaceUnit(unitId))}
          sellUnit={(unitId: string) => dispatch(sellUnit(unitId))}
        />
      </Col>

      <Col xs="6">
        <div className="game-center-container">
          <Row>
            <Col className="h-flex-align-center top-bar">
              {enemy && <Player {...enemy} isEnemy={true} />}
              {!enemy && <WaitingForPlayer />}
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
  unitsPlacement: gameState!.unitsPlacement,
});

export default connect(mapStateToProps)(GamePage);
