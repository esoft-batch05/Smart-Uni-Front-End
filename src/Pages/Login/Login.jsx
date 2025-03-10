import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Grid, 
  Paper,
  Link
} from '@mui/material';
import Image from '../../assets/Images/Group 1000002552.png'
import UserServices from '../../Services/UserService';
import { showAlert } from '../../Utils/alertUtils';
import { showLoading, hideLoading } from '../../Utils/loadingUtils';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setTokens } from "../../Reducers/authSlice";
import { updateUser } from '../../Reducers/userSlice';


const LoginPage = () => {
  const [formValues, setFormValues] = useState({
    email: '',
    password: ''
  });
  let role;

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const login = async (email, password) => {
    showLoading('Login...');
    try {
      const response = await UserServices.userLogin({
        email: email,
        password: password,
      });
      showAlert('success', 'Login successful!');
      dispatch(
        setTokens({
          accessToken: await response.data.token,
          refreshToken: await response.data.refreshToken,
        })
      );
      dispatch(
        updateUser({
          _id: await response.data._id,
          firstName: await response.data.firstName,
          email: await response.data.email,
          role: await response.data.role,
          phone: await response.data.phone,
          dob: await response.data.dob,
        })
      );
      role = response?.data?.role;
      if(role === 'student'){
        navigate('/student-dashboard')
      }else if (role === 'lecturer'){
        navigate('/lecturer-dashboard')
      }else{
        navigate('/admin-dashboard')
      }
      console.log(role);
      
    } catch (error) {
      console.error("Failed to fetch orders:", error.message);
      showAlert('error', 'Login Failed!');
    }finally{
      hideLoading();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    login(formValues.email, formValues.password);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100%',
      overflow: 'hidden'
    }}>
      {/* Left side - Image section (50%) */}
      <Box sx={{ 
        width: '50%', 
        // bgcolor: '#FF8C00', 
        display: { xs: 'none', md: 'flex' },
        position: 'relative'
      }}>
        <img 
          src={Image} 
          alt="Student with books" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </Box>
      
      {/* Right side - Form section (50%) */}
      <Box sx={{ 
        width: { xs: '100%', md: '50%' },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 4
      }}>
        <Paper elevation={0} sx={{ 
          p: 4, 
          width: '100%', 
          maxWidth: '480px',
          bgcolor: '#f5f5f5',
          borderRadius: 2
        }}>
          <Typography variant="h3" component="h1" align="start" fontWeight="bold" mb={3}>
            Login
          </Typography>
          
          <Typography variant="body2" align="start" mb={4} color="text.secondary">
            Log in to Discover Your Dream Course and University. Get
            Personalized Guidance and Expert Tips Installation!
          </Typography>
          
          <Box component="form" onSubmit={handleClick} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              size='medium'
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={formValues.email}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              size='medium'
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formValues.password}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 3 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 1, 
                mb: 2, 
                py: 1.5,
                bgcolor: '#FF8C00',
                '&:hover': {
                  bgcolor: '#e67e00',
                },
                fontWeight: 'medium',
                fontSize: '1rem'
              }}
            >
              Sign In
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" display="inline" color="text.secondary">
                Don't have an account? 
              </Typography>
              <Link href="signup" variant="body2" sx={{ ml: 0.5, color: '#FF8C00' }}>
                Sign Up
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginPage;