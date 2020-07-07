import { AnyAction, Dispatch as OldDispatch } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { RootSchema } from "./root-schema";

export type Dispatch = ThunkDispatch<RootSchema, void, AnyAction> & OldDispatch;
