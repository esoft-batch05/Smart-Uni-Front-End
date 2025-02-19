import React from "react";
import { Box, Container, Grid, Typography, IconButton, SvgIcon } from "@mui/material";
import { styled } from "@mui/system";
import FacebookIcon from "@mui/icons-material/Facebook";
import YoutubeIcon from "@mui/icons-material/Youtube";
import InstagramIcon from "@mui/icons-material/Instagram";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import MyLogo from "../../assets/Images/Logo White PNG.png";

const TikTokIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
  </SvgIcon>
);

const primary = {
  lighter: "#F4FAFF",
  light: "#C1E3FF",
  main: "#309BFD",
  dark: "#0C44AE",
  darker: "#042174",
  contrastText: "#FFFFFF",
};

const StyledFooter = styled("footer")({
  backgroundColor: primary.darker,
  color: primary.contrastText,
  padding: "2rem 0",
});

const Logo = styled("img")({
  height: "65px",
  marginBottom: "0.7rem",
  padding: "3px",
});

const MenuItem = styled(Typography)({
  color: primary.light,
  "&:hover": {
    color: primary.lighter,
  },
  display: "inline-block",
  marginRight: "1rem",
  cursor: "pointer",
});

const ContactInfo = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginBottom: "0.5rem",
});

const Footer = () => {
  const handleMenuItemClick = (item) => {
    console.log(`${item} clicked`);
  };

  const handleSocialMediaClick = (platform) => {
    const urls = {
      Facebook: "https://www.facebook.com/profile.php?id=61563005853057",
      Youtube: "https://www.youtube.com/channel/UC2eL3udoPxkMM-6wlbNVFqw",
      Instagram: "https://www.instagram.com/iei.education.lk?igsh=cTB0cndxcndhejlw",
      TikTok: "https://www.tiktok.com/@ieiedu.lk?_t=8oceQqmX44I&_r=1",
    };
    window.open(urls[platform], "_blank");
  };

  const menuItems = ["Home", "About", "Services", "Contact"];

  return (
    <StyledFooter>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <Logo src={MyLogo} alt="Company Logo" />
            <Typography variant="body2">
              © 2024 International English Institute
            </Typography>
          </Grid>
          <Grid item xs={3} sm={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                textAlign: { sm: "center", xs: "start" },
              }}
            >
              {menuItems.map((item) => (
                <MenuItem
                  key={item}
                  variant="body2"
                  onClick={() => handleMenuItemClick(item)}
                  gutterBottom
                >
                  {item}
                </MenuItem>
              ))}
            </Box>
          </Grid>

          <Grid item xs={4} sm={3}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Box>
              <IconButton color="inherit" aria-label="Facebook" onClick={() => handleSocialMediaClick('Facebook')}>
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Youtube" onClick={() => handleSocialMediaClick('Youtube')}>
                <YoutubeIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram" onClick={() => handleSocialMediaClick('Instagram')}>
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="TikTok" onClick={() => handleSocialMediaClick('TikTok')}>
                <TikTokIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={5} sm={3}>
            <Box>
              <ContactInfo>
                <LocationOnIcon sx={{ marginRight: 1 }} />
                <Typography variant="body2">
                  Comobo 04
                </Typography>
              </ContactInfo>
              <ContactInfo>
                <PhoneIcon sx={{ marginRight: 1 }} />
                <Typography variant="body2">071 7442 222</Typography>
              </ContactInfo>
              <ContactInfo>
                <PhoneIcon sx={{ marginRight: 1 }} />
                <Typography variant="body2">070 3892 337</Typography>
              </ContactInfo>
              <ContactInfo>
                <PhoneIcon sx={{ marginRight: 1 }} />
                <Typography variant="body2">070 1113 870</Typography>
              </ContactInfo>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </StyledFooter>
  );
};

export default Footer;
