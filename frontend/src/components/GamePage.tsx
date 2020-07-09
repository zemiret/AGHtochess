import React from "react";
import { PlayerInfo, Unit } from "../models/game-state.model";
import { RootSchema } from "../store/root-schema";
import { connect } from "react-redux";
import Player from "./Player";
import GamePhaseSpecificCenter from "./GamePhaseSpecificCenter";
import { Col, Row } from "reactstrap";
import GamePhaseSpecificSidebar from "./GamePhaseSpecificSidebar";
import Backpack from "./Backpack";
import { Dispatch } from "../store";
import { selectUnit } from "../store/actions";

interface Props {
  player: PlayerInfo;
  enemy: PlayerInfo;
  units: Unit[];
  selectedUnit: Unit | null;
  dispatch: Dispatch;
}

const GamePage: React.FunctionComponent<Props> = ({
  player,
  enemy,
  units,
  dispatch,
  selectedUnit,
}: Props) => {
  return (
    <div>
      <Row className="game-panel-row">
        <Col xs="3">
          <Backpack
            units={units}
            selectedUnit={selectedUnit}
            selectUnit={(unit: Unit) => dispatch(selectUnit(unit))}
          />
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

const mapStateToProps = ({ gameState, selectedUnit }: RootSchema) => ({
  player: gameState!.player,
  enemy: gameState!.enemy,
  units: gameState!.units,
  selectedUnit,
});

export default connect(mapStateToProps)(GamePage);
