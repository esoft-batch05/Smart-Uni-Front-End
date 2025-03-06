import React from "react";
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
import UserServices from '../../Services/UserService';
import { showAlert } from "../../Utils/alertUtils";
import { showLoading, hideLoading } from '../../Utils/loadingUtils';
import { useNavigate } from "react-router-dom";


const SignUp = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
      dateOfBirth: null,
      role: "",
    },
  });

    const navigate = useNavigate();
  

  const register = async (data) => {
    showLoading('Creating account...');
    try{
      const response = await UserServices.userRegister(data);
      console.log(response);
      navigate('/login');
      showAlert('success', 'Registration successful!');
    }catch(err){
      showAlert('error', 'Registration Failed!');
      console.log(err);
    }finally{
      hideLoading();
    }
  }

  const onSubmit = (data) => {
    console.log(data);
    register(data);
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
            sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 4 }}
          >
            <Card sx={{ maxWidth: 500, width: "100%", boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3}>
                  WELCOME
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Name is required" }}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label="Name" margin="normal" variant="outlined" error={!!errors.name} helperText={errors.name?.message} />
                    )}
                  />

                  <Controller
                    name="email"
                    control={control}
                    rules={{ required: "Email is required" }}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label="Email" margin="normal" variant="outlined" error={!!errors.email} helperText={errors.email?.message} />
                    )}
                  />

                  <Controller
                    name="password"
                    control={control}
                    rules={{ required: "Password is required" }}
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
                              <IconButton onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
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
                      <TextField {...field} fullWidth label="Phone Number" margin="normal" variant="outlined" error={!!errors.phone} helperText={errors.phone?.message} />
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
                            textField: { fullWidth: true, margin: "normal", variant: "outlined", error: !!errors.dateOfBirth, helperText: errors.dateOfBirth?.message },
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
                      <FormControl fullWidth margin="normal" error={!!errors.role}>
                        <InputLabel>Role</InputLabel>
                        <Select {...field} label="Role">
                          <MenuItem value="lecturer">I'm a Student</MenuItem>
                          <MenuItem value="student">I'm a Lecturer</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />

                  <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, bgcolor: "#FF8C00", "&:hover": { bgcolor: "#E67E00" } }}>
                    Sign Up
                  </Button>

                  <Typography variant="body2" textAlign="center" mt={2}>
                    Already have an account? <Link href="/login" sx={{ color: "#FF8C00" }}>Sign In</Link>
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