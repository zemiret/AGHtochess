import React from "react";
import { PlayerInfo } from "../models/game-state.model";
import { RootSchema } from "../store/root-schema";
import { connect } from "react-redux";
import Player from "./Player";
import GamePhaseSpecific from "./GamePhaseSpecific";
import Timer from "./Timer";

interface Props {
  player: PlayerInfo;
  enemy: PlayerInfo;
  phase: string;
  round: number;
  phaseEndsAt: number;
}

const GamePage: React.FunctionComponent<Props> = ({
  player,
  enemy,
  phase,
  round,
  phaseEndsAt,
}: Props) => {
  return (
    <div>
      <Timer phase={phase} phaseEndsAt={phaseEndsAt} round={round} />
      <h1>Player</h1>
      <Player {...player} />
      <h1>Enemy</h1>
      <Player {...enemy} />
      <hr />
      <GamePhaseSpecific />
    </div>
  );
};

const mapStateToProps = ({ gameState }: RootSchema) => ({
  player: gameState!.player,
  enemy: gameState!.enemy,
  phase: gameState!.phase,
  round: gameState!.round,
  phaseEndsAt: gameState!.phaseEndsAt,
});

export default connect(mapStateToProps)(GamePage);
