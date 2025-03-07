import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  alerts: [],
  nextId: 1,
};

export const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addAlert: (state, action) => {
      const { type, message, duration = 5000 } = action.payload;
      state.alerts.push({
        id: state.nextId,
        type,
        message,
        duration,
      });
      state.nextId += 1;
    },
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
    },
  },
});

export const { addAlert, removeAlert } = alertsSlice.actions;
export default alertsSlice.reducer;