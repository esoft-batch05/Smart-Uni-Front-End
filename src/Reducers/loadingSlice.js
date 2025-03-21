// src/Reducers/loadingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    isLoading: false,
    loadingText: '',
  },
  reducers: {
    startLoading: (state, action) => {
      state.isLoading = true;
      state.loadingText = action.payload || 'Loading...';
    },
    stopLoading: (state) => {
      state.isLoading = false;
      state.loadingText = '';
    },
  },
});

export const { startLoading, stopLoading } = loadingSlice.actions;
export default loadingSlice.reducer;