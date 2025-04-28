import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import statisticSettingsSlice from "./slices/settingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    statisticSettings: statisticSettingsSlice,
  },
});
