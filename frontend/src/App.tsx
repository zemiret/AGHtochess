import React from "react";
import PageController from "./components/PageController";
import Toast from "./components/Toast";

const App: React.FunctionComponent = () => {
  return (
    <>
      <Toast />
      <PageController />
    </>
  );
};

export default App;
