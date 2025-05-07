import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMe } from '../../services/me';


export const fetchPersonalProfile = createAsyncThunk(
  "profile/getPersonalProfile",
  async () => {
    const res = await getMe();
    return res.data;
  }
);

const initialState = {
  data: null,
  userId: null,
  role: null,
  loading: false,
  error: null,
};

const getPersonalProfileSlice = createSlice({
  name: "profile",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchPersonalProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPersonalProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;;
        state.role = action.payload.role[0];
        state.userId = action.payload.id;
      })
      .addCase(fetchPersonalProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
})

export default getPersonalProfileSlice.reducer