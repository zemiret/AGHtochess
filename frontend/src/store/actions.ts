import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

// export const buyUnit = createAction<{ unitId: number }>("Buy Unit");

export const buyUnit = createAsyncThunk<number, number>(
    "BuyUnit",
    async (unitId: number) => {
        console.log(unitId)
        return 1;
    }
)