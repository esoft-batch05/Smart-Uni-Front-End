import React from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";
import Limage from "../../assets/usermanageimge/Limage2.png"; // Import your image

const RootContainer = styled("div")({
  display: "flex",
  height: "100vh",
  alignItems: "center",
  justifyContent: "center",
  background: "#fff",
  position: "relative",
  flexDirection: "row",
  '@media (max-width: 768px)': {
    flexDirection: "column", // Stack elements on smaller screens
  },
});

const LeftBox = styled(Box)({
  width: "35%",
  height: "100%",
  background: "#ff7a00",
  '@media (max-width: 768px)': {
    width: "100%", // Full width on smaller screens
    height: "200px", // Limit the height for smaller screens
    position: "relative",
  },
});

const RightBox = styled(Box)({
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  '@media (max-width: 768px)': {
    justifyContent: "flex-start", // Align to the top on smaller screens
  },
});

const SignupBox = styled(Box)({
  width: "450px",
  padding: "30px",
  borderRadius: "10px",
  background: "#f8f8f8",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  zIndex: 20, // Ensure the form stays above the image
  '@media (max-width: 768px)': {
    width: "90%", // Take 90% of the width on smaller screens
    padding: "20px",
  },
});

const SignupButton = styled(Button)({
  backgroundColor: "#ff7a00",
  color: "white",
  fontWeight: "bold",
  marginTop: "20px",
  "&:hover": {
    backgroundColor: "#e66a00",
  },
});

const PopUpImage = styled("img")({
  position: "absolute",
  left: "35%",
  top: "57.5%",
  transform: "translate(-50%, -50%)",
  width: "1000px",
  zIndex: "10", // Make sure image stays below the form

});

const Signup = () => {
  return (
    <RootContainer>
      <LeftBox />
      <PopUpImage src={Limage} alt="Login Illustration" />
      <RightBox>
        <SignupBox>
          <Typography variant="h5" fontWeight="bold">WELCOME</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 ,textAlign: "center", 
    fontSize: "0.85rem",  }}>
          Sign Up Today! Your Path to a Successful Career Begins Here—Explore Universities, Find the Perfect Course, and Start Building Your Future!
          </Typography>
          <TextField fullWidth label="Name" variant="outlined" sx={{ mb: 2 }} />
          <TextField fullWidth label="Email" variant="outlined" sx={{ mb: 2 }} />
          <TextField fullWidth label="Password" type="password" variant="outlined" sx={{ mb: 2 }} />
          <SignupButton fullWidth variant="contained">Sign Up</SignupButton>
          <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account? <a href="/signup" style={{ color: "#ff7a00", textDecoration: "none" }}>Sign in</a>
          </Typography>
        </SignupBox>
      </RightBox>
    </RootContainer>
  );
};

export default Signup;

