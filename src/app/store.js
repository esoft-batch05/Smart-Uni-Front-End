import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../Reducers/counterSlice';
import authReducer from "../Reducers/authSlice";
import alertsReducer from '../Reducers/alertsSlice';


const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    alerts: alertsReducer,
  
  },
});

export default store;
