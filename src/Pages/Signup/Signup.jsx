import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Link,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Image from "../../assets/Images/Group 1000002553.jpg";
import UserServices from "../../Services/UserService";
import { showAlert } from "../../Utils/alertUtils";
import { showLoading, hideLoading } from "../../Utils/loadingUtils";
import { useNavigate } from "react-router-dom";
import EmailServices from "../../Services/EmailService";
import { useSelector } from "react-redux";

const SignUp = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [mail, setMail] = React.useState('');
  const userEmail = useSelector((state) => state.user?.email);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      dateOfBirth: null,
      role: "",
    },
  });

  // Use watch to get the password value for validation
  const password = watch("password");
  const navigate = useNavigate();

  useEffect(() => {
    if (mail) {
      sendEmail({
        to: mail,
        subject: "🎉 Welcome to Our Platform! Your Registration is Successful 🎉",
        text: "Your registration is successful!", // Plain text fallback
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background-color: #f4f4f4; border-radius: 10px;">
            <div style="background-color: #007bff; color: white; text-align: center; padding: 15px; border-radius: 10px 10px 0 0;">
              <h2>Welcome to Our Platform! 🎉</h2>
            </div>
            <div style="background: white; padding: 20px; border-radius: 0 0 10px 10px;">
              <p>Dear User,</p>
              <p>We're excited to welcome you! Your registration was successful, and your account is now active. 🎊</p>
              <h3 style="color: #007bff;">Next Steps:</h3>
              <ul>
                <li>🎯 <strong>Login</strong>: <a href="https://yourwebsite.com/login" style="color: #007bff; text-decoration: none;">Click here to log in</a></li>
                <li>📖 <strong>Explore</strong>: Discover features, interact, and enjoy your journey.</li>
                <li>📩 <strong>Support</strong>: Need help? Contact us anytime.</li>
              </ul>
              <p>Thank you for joining us! If you have any questions, feel free to reply to this email.</p>
              <p>Best Regards,<br><strong>Your Company Name</strong></p>
            </div>
          </div>
        `,
      });
      
    }
  }, [mail]); 
  
  const register = async (data) => {
    // Remove confirmPassword from data before sending to API
    const { confirmPassword, ...registerData } = data;
    
    showLoading("Creating account...");
    try {
      const response = await UserServices.userRegister(registerData);
      console.log(response);
      
      setMail(response?.data?.email);
      
       
      showAlert("success", "Registration successful!");
    } catch (err) {
      showAlert("error", "Registration Failed!");
      console.log(err);
    } finally {
      hideLoading();
    }
  };

  const onSubmit = (data) => {
    console.log(data);
    register(data);
    
  };

  const sendEmail = async (data) => {
    try{
      const response = EmailServices.sendEmail(data);
      navigate("/login");
    }catch(error){
      console.log(error);
    }
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        bgcolor: "#000",
      }}
    >
      <Paper elevation={0} sx={{ width: "100%", overflow: "hidden" }}>
        <Grid container sx={{ minHeight: "100vh" }}>
          {/* Left side - Image */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              width: "100%",
              height: "100vh",
            }}
          >
            <Box
              component="img"
              src={Image}
              alt="Person holding book"
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Grid>

          {/* Right side - Form */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 4,
            }}
          >
            <Card sx={{ maxWidth: 500, width: "100%", boxShadow: 3 }}>
              <CardContent>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  textAlign="center"
                  mb={3}
                >
                  WELCOME
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Controller
                        name="firstName"
                        control={control}
                        rules={{ required: "First Name is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="First Name"
                            margin="normal"
                            variant="outlined"
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Controller
                        name="lastName"
                        control={control}
                        rules={{ required: "Last Name is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Last Name"
                            margin="normal"
                            variant="outlined"
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>

                  <Controller
                    name="email"
                    control={control}
                    rules={{ 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Email"
                        margin="normal"
                        variant="outlined"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    )}
                  />

                  <Controller
                    name="password"
                    control={control}
                    rules={{ 
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters"
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Password"
                        margin="normal"
                        variant="outlined"
                        type={showPassword ? "text" : "password"}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{ 
                      required: "Please confirm your password",
                      validate: value => 
                        value === password || "Passwords do not match"
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Confirm Password"
                        margin="normal"
                        variant="outlined"
                        type={showConfirmPassword ? "text" : "password"}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="phoneNumber"
                    control={control}
                    rules={{ required: "Phone number is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Phone Number"
                        margin="normal"
                        variant="outlined"
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber?.message}
                      />
                    )}
                  />

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                      name="dateOfBirth"
                      control={control}
                      rules={{ required: "Date of Birth is required" }}
                      render={({ field }) => (
                        <DatePicker
                          label="Date of Birth"
                          value={field.value}
                          onChange={field.onChange}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              margin: "normal",
                              variant: "outlined",
                              error: !!errors.dateOfBirth,
                              helperText: errors.dateOfBirth?.message,
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>

                  <Controller
                    name="role"
                    control={control}
                    rules={{ required: "Role is required" }}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.role}
                      >
                        <InputLabel>Role</InputLabel>
                        <Select {...field} label="Role">
                          <MenuItem value="student">I'm a Student</MenuItem>
                          <MenuItem value="lecturer">I'm a Lecturer</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      bgcolor: "#FF8C00",
                      "&:hover": { bgcolor: "#E67E00" },
                    }}
                  >
                    Sign Up
                  </Button>

                  <Typography variant="body2" textAlign="center" mt={2}>
                    Already have an account?{" "}
                    <Link href="/login" sx={{ color: "#FF8C00" }}>
                      Sign In
                    </Link>
                  </Typography>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SignUp;