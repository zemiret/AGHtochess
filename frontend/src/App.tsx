import React from "react";
import { buyUnit } from "./store/actions";
import { RootSchema } from "./store/root-schema";
import { connect } from "react-redux";
import { Dispatch } from "./store";
import PageController from "./components/PageController";

import { Button } from "reactstrap";

interface Props {
  dispatch: Dispatch;
}

const App: React.FunctionComponent<Props> = ({ dispatch }: Props) => {
  return (
    <div>
      <PageController />
    </div>
  );
};

const mapStateToProps = (state: RootSchema) => ({
  gameState: state.gameState,
});

export default connect(mapStateToProps)(App);
