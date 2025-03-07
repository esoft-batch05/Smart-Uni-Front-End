import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../Reducers/counterSlice';
import authReducer from "../Reducers/authSlice";
import alertsReducer from '../Reducers/alertsSlice';
import loadingReducer from '../Reducers/loadingSlice';
import userReducer from '../Reducers/userSlice';


const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    alerts: alertsReducer,
    loading: loadingReducer,
    user: userReducer,
  
  },
});

export default store;
