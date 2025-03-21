import { addAlert } from '../Reducers/alertsSlice';
import  store from '../app/store';

export const showAlert = (type, message) => {
  store.dispatch(addAlert({ type, message }));
};
