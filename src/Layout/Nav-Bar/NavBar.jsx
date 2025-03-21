import {
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
  Box,
  Button,
} from "@mui/material";
import Logo from "../../../src/assets/Images/Logo.png";
import { useNavigate } from "react-router-dom";

const NavBar = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backdropFilter: "blur(10px)",
          transition: "backdrop-filter 0.3s ease-in-out",
          boxShadow: "none",
          backgroundColor: "rgb(255, 255, 255)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Box
            component="img"
            sx={{
              height: { xs: 45, sm: 45, md: 60, lg: 63 },
              width: "auto",
            }}
            alt="Your logo"
            src={Logo}
          />

          {/* Buttons on the right side */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" color="primary" onClick={()=> navigate('/login')} >
              Login
            </Button>
            <Button variant="contained" color="primary" onClick={()=> navigate('/signup')}>
              Signup
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box>{children}</Box>
    </>
  );
};

export default NavBar;
