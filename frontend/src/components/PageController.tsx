import React from "react";
import { RootSchema } from "../store/root-schema";
import LoginPage from "./LoginPage";
import LobbyPage from "./LobbyPage";
import { connect } from "react-redux";

interface Props {
  showLogin: boolean;
}

const PageController: React.FunctionComponent<Props> = ({ showLogin }: Props) => {
  return (
    <>
      {showLogin && <LoginPage />}
      {!showLogin && <LobbyPage />}
    </>
  );
};

const mapStateToProps = (state: RootSchema) => ({
  showLogin: state.socketState === "closed" || state.socketState === "connecting",
});

export default connect(mapStateToProps)(PageController);
