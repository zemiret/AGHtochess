import { createAction } from "@reduxjs/toolkit";

export const buyUnit = createAction<{ unitId: number }>("Buy Unit");
