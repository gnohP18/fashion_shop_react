import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: null,
  refreshToken: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      const { accessToken, refreshToken, user } = action.payload;

      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.user = user;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
  },
});

export const { setAuthData, logout } = authSlice.actions;
export default authSlice.reducer;
