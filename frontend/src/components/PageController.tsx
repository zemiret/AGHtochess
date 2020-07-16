import React from "react";
import { RootSchema } from "../store/root-schema";
import LoginPage from "./LoginPage";
import LobbyPage from "./LobbyPage";
import { connect } from "react-redux";
import GamePage from "./GamePage";
import StatsPage from "./StatsPage";

interface Props {
  state: "login" | "lobby" | "game" | "stats";
}

const PageController: React.FunctionComponent<Props> = ({ state }: Props) => {
  switch (state) {
    case "login":
      return <LoginPage />;

    case "lobby":
      return <LobbyPage />;

    case "game":
      return <GamePage />;

    case "stats":
      return <StatsPage />;
  }
};

const mapStateToProps = ({ state }: RootSchema) => ({ state });

export default connect(mapStateToProps)(PageController);
