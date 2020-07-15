import React from "react";
import ReactDOM from "react-dom";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { configureStore, getDefaultMiddleware, Middleware, AnyAction, MiddlewareAPI } from "@reduxjs/toolkit";
import { rootReducer } from "./store/reducers";
import { Dispatch } from "./store";
import { initialState } from "./store/root-schema";

const storedStats = JSON.parse(localStorage.getItem("stats") ?? "{}")
const saveStorageMiddleware: Middleware = (store: MiddlewareAPI) => (next: Dispatch) => (action: AnyAction) => { 
  next(action);
  if(action.type.startsWith("stats/")) {
    const state = store.getState();
    localStorage.setItem("stats", JSON.stringify(state.stats));
  }
}

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ["connectWebSocket/fulfilled"],
    },
  }).concat(saveStorageMiddleware),
  preloadedState: {
    ...initialState,
    stats: storedStats
  }
});


ReactDOM.render(
  <Provider store={store}>
    <DndProvider backend={HTML5Backend}>
      <App />
    </DndProvider>
  </Provider>,
  document.getElementById("root"),
);
