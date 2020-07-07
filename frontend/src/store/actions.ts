import { createAsyncThunk } from "@reduxjs/toolkit";

export const buyUnit = createAsyncThunk("buyUnit", async (_: number) => {
  return 1;
});
