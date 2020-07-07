import React from "react";
import { buyUnit } from "./store/actions";
import { RootSchema } from "./store/root-schema";
import { connect } from "react-redux";
import { Dispatch } from "redux";

interface Props {
  gameState: string;
  dispatch: Dispatch;
}

const App: React.FunctionComponent<Props> = ({ gameState, dispatch }: Props) => {
  return (
    <div>
      <p>Hello, World! {gameState}</p>
      <button onClick={() => dispatch(buyUnit(1))}>Click</button>
    </div>
  );
};

const mapStateToProps = (state: RootSchema) => ({
  gameState: state.gameState,
});

export default connect(mapStateToProps)(App);
