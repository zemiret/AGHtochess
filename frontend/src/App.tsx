import React from "react";
import { buyUnit } from './store/actions'
import { RootSchema } from "./store/root-schema";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

class App extends React.Component { 
  render() {
    return (
      <div>
        <p>Hello, World! {this.state}</p>
        <button onClick={() => buyUnit({unitId:1})}>Click</button>
      </div>
    );
  };
}

const mapStateToProps = (state: RootSchema) => ({
  state: state.gameState
})

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  buyUnit
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(App);
