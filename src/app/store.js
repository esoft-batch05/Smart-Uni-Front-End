import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../Reducers/counterSlice';
import authReducer from "../Reducers/authSlice";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
  },
});

export default store;
