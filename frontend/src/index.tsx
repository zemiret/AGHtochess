import React from "react";
import ReactDOM from "react-dom";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import {
  configureStore,
  getDefaultMiddleware,
  Middleware,
  AnyAction,
  MiddlewareAPI,
} from "@reduxjs/toolkit";
import { rootReducer } from "./store/reducers";
import { Dispatch } from "./store";
import { initialState, RootSchema } from "./store/root-schema";
import { EventsObserver } from "./store/stats/events-observer";

const eventsObserver = new EventsObserver();

const getStoredStats = () => {
  return Array.from(Array(localStorage.length).keys())
    .map(k => localStorage.key(k) as string)
    .reduce(
      (prev, cur) => ({
        ...prev,
        [cur]: JSON.parse(localStorage.getItem(cur) ?? "{}"),
      }),
      {},
    );
};

const storedStats = getStoredStats();

const saveStorageMiddleware: Middleware = (store: MiddlewareAPI) => (
  next: Dispatch,
) => (action: AnyAction) => {
  next(action);
  if (action.type.startsWith("stats/")) {
    const state = store.getState() as RootSchema;
    localStorage.setItem(state.username, JSON.stringify(state.stats[state.username]));
  }
};

const statsMiddleware: Middleware = (store: MiddlewareAPI) => (next: Dispatch) => (
  action: AnyAction,
) => {
  next(action);
  eventsObserver.storeChanged(store, action);
};

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ["connectWebSocket/fulfilled"],
    },
  }).concat([saveStorageMiddleware, statsMiddleware]),
  preloadedState: {
    ...initialState,
    stats: storedStats,
  },
});

ReactDOM.render(
  <Provider store={store}>
    <DndProvider backend={HTML5Backend}>
      <App />
    </DndProvider>
  </Provider>,
  document.getElementById("root"),
);
