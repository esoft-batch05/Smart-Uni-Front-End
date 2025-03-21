// src/utils/loading.js
import { startLoading, stopLoading } from '../Reducers/loadingSlice';
import store from '../app/store';

// Function to show loading animation
export const showLoading = (text = 'Loading...') => {
  store.dispatch(startLoading(text));
};

// Function to hide loading animation
export const hideLoading = () => {
  store.dispatch(stopLoading());
};