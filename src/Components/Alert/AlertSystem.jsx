import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, Snackbar, Stack, Slide } from '@mui/material';
import { removeAlert } from '../../Reducers/alertsSlice';

// Slide transition component (customized exit animation)
function SlideTransition(props) {
  return <Slide {...props} direction="right" />;
}

const AlertSystem = () => {
  const alerts = useSelector((state) => state.alerts.alerts);
  const dispatch = useDispatch();

  const handleClose = (id) => {
    dispatch(removeAlert(id));
  };

  return (
    <Stack
      spacing={2}
      sx={{
        position: 'fixed',
        bottom: 24,
        left: 24, // Positioned on the left
        zIndex: 2000,
      }}
    >
      {alerts.map((alert) => (
        <Snackbar
          key={alert.id}
          open={true}
          autoHideDuration={alert.duration}
          onClose={() => handleClose(alert.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          TransitionComponent={SlideTransition} // Adding transition animation
        >
          <Alert
            onClose={() => handleClose(alert.id)}
            severity={alert.type}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
};

export default AlertSystem;
