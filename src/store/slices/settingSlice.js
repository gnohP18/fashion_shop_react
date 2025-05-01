import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getStatisticSetting } from "../../services/setting";

export const fetchStatisticSetting = createAsyncThunk(
  "settings/getStatisticSetting",
  async () => {
    const res = await getStatisticSetting();
    return res.data;
  }
);

const statisticSettingsSlice = createSlice({
  name: "settings",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatisticSetting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatisticSetting.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStatisticSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default statisticSettingsSlice.reducer;