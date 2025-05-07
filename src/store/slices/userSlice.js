import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../services/apiAdmin";

export const getListUserThunk = createAsyncThunk('users/getListUser', async (params) => {
  return await apiClient.get('api/user-management', params);
});

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getListUserThunk.fulfilled, (state, action) => {
        state.users = action.payload.data;
        state.loading = false;
      })
      .addCase(getListUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Không thể lấy danh sách người dùng';
      });
  },
});

export default userSlice.reducer;