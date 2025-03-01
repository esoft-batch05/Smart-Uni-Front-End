import { addAlert } from '../Reducers/alertsSlice';
import  store from '../app/store';

export const showAlert = (type, message, duration) => {
  store.dispatch(addAlert({ type, message, duration }));
};
