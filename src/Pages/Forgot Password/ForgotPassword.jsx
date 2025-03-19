import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel,
  Alert,
  IconButton,
  InputAdornment,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Email as EmailIcon, 
  LockOutlined as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const ForgotPassword = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const steps = ['Email Verification', 'OTP Verification', 'Reset Password'];

  const handleNext = () => {
    setError('');
    
    if (activeStep === 0) {
      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }
      // Simulate sending OTP
      simulateSendOTP();
      setActiveStep(1);
    } else if (activeStep === 1) {
      if (!validateOTP(otp)) {
        setError('Please enter a valid 6-digit OTP');
        return;
      }
      // Simulate OTP verification
      if (otp === '123456') { // For demo purposes
        setActiveStep(2);
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } else if (activeStep === 2) {
      if (!validatePassword(password)) {
        setError('Password must be at least 8 characters with a number and special character');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      // Simulate password reset
      simulatePasswordReset();
      setActiveStep(3);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
    setError('');
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateOTP = (otp) => {
    return /^\d{6}$/.test(otp);
  };

  const validatePassword = (password) => {
    return password.length >= 8 && 
           /\d/.test(password) && 
           /[!@#$%^&*(),.?":{}|<>]/.test(password);
  };

  const simulateSendOTP = () => {
    // In a real app, this would call an API to send an OTP
    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const simulatePasswordReset = () => {
    // In a real app, this would call an API to reset the password
    console.log('Password reset successful');
  };

  const handleResendOTP = () => {
    simulateSendOTP();
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          {activeStep === 3 ? (
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ 
                backgroundColor: 'success.light', 
                borderRadius: '50%', 
                width: 64, 
                height: 64, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                margin: '0 auto 16px'
              }}>
                <LockIcon sx={{ color: 'white', fontSize: 36 }} />
              </Box>
              <Typography variant="h5" component="h1" gutterBottom>
                Password Reset Successful!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Your password has been successfully reset. You can now log in with your new password.
              </Typography>
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ mt: 2 }}
                onClick={() => window.location.href = '/login'} // Redirect to login in a real app
              >
                Back to Login
              </Button>
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                {activeStep > 0 && (
                  <IconButton onClick={handleBack} sx={{ mr: 1 }}>
                    <ArrowBackIcon />
                  </IconButton>
                )}
                <Typography variant="h5" component="h1">
                  Forgot Password
                </Typography>
              </Box>
              
              <Stepper activeStep={activeStep} alternativeLabel={!isMobile} orientation={isMobile ? "vertical" : "horizontal"} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{isMobile ? label : null}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
              
              {activeStep === 0 && (
                <Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Enter your email address and we'll send you a verification code to reset your password.
                  </Typography>
                  <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    type="email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              )}
              
              {activeStep === 1 && (
                <Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    We've sent a 6-digit verification code to {email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Enter the code below to verify your email.
                  </Typography>
                  <TextField
                    fullWidth
                    label="Verification Code"
                    variant="outlined"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    margin="normal"
                    inputProps={{ maxLength: 6 }}
                  />
                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Didn't receive the code?
                    </Typography>
                    <Button 
                      disabled={countdown > 0} 
                      onClick={handleResendOTP} 
                      variant="text" 
                      size="small"
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                    </Button>
                  </Box>
                </Box>
              )}
              
              {activeStep === 2 && (
                <Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Create a new password for your account.
                  </Typography>
                  <TextField
                    fullWidth
                    label="New Password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, mb: 2 }}>
                    Password must be at least 8 characters with a number and special character.
                  </Typography>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    variant="outlined"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    margin="normal"
                    type={showConfirmPassword ? 'text' : 'password'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              )}
              
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ mt: 3 }}
                onClick={handleNext}
              >
                {activeStep === 0 ? 'Send Verification Code' : 
                 activeStep === 1 ? 'Verify Code' : 'Reset Password'}
              </Button>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;