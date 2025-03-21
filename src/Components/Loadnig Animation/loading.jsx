// src/components/LoadingSpinner.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Backdrop, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = () => {
  const { isLoading, loadingText } = useSelector(state => state.loading);

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
      {loadingText && (
        <Typography variant="h6">
          {loadingText}
        </Typography>
      )}
    </Backdrop>
  );
};

export default LoadingSpinner;