import React from "react";
import { PlayerInfo } from "../models/game-state.model";

const Player: React.FunctionComponent<PlayerInfo> = ({
  username,
  hp,
  money,
}: PlayerInfo) => {
  return (
    <div>
      <h3>Username</h3>
      <p>{username}</p>
      <h3>HP</h3>
      <p>{hp}</p>
      <h3>Money</h3>
      <p>{money}</p>
    </div>
  );
};

export default Player;
