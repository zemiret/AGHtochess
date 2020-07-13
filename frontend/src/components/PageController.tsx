import React, { useEffect } from "react";
import { RootSchema } from "../store/root-schema";
import LoginPage from "./LoginPage";
import LobbyPage from "./LobbyPage";
import { connect } from "react-redux";
import GamePage from "./GamePage";
import { Dispatch } from "../store";
import { gamePlayed } from "../store/stats/actions";
import StatsPage from "./StatsPage";

interface Props {
  state: "login" | "lobby" | "game" | "stats";
  dispatch: Dispatch
}

const PageController: React.FunctionComponent<Props> = ({ state, dispatch }: Props) => {
  useEffect(() => {
    if(state === "game") {
      dispatch(gamePlayed())
    }
  }, [state]);
  switch (state) {
    case "login":
      return <LoginPage />;

    case "lobby":
      return <LobbyPage />;

    case "game":
      return <GamePage />;

    case "stats":
        return <StatsPage/>;
  }
};

const mapStateToProps = ({ state }: RootSchema) => ({ state });

export default connect(mapStateToProps)(PageController);
