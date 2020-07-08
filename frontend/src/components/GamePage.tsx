import React from "react";
import { PlayerInfo } from "../models/game-state.model";
import { RootSchema } from "../store/root-schema";
import { connect } from "react-redux";
import Player from "./Player";

interface Props {
  player: PlayerInfo;
  enemy: PlayerInfo;
}

const GamePage: React.FunctionComponent<Props> = ({ player, enemy }: Props) => {
  return (
    <div>
      <h1>Player</h1>
      <Player {...player} />
      <h1>Enemy</h1>
      <Player {...enemy} />
    </div>
  );
};

const mapStateToProps = ({ gameState }: RootSchema) => ({
  player: gameState!.player,
  enemy: gameState!.enemy,
});

export default connect(mapStateToProps)(GamePage);
