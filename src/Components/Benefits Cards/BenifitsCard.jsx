import { Box, Divider, Grid, Typography } from "@mui/material";
import Global from "../../assets/Icon/global.png";
import Speak from "../../assets/Icon/speak.png";
import Travelling from "../../assets/Icon/man-con.png";
import Friend from "../../assets/Icon/friends.png";
import React, { useEffect } from "react";
import Aos from "aos";

function BenifitsCard() {

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <Box display="flex" justifyContent="center">
  <Grid container spacing={10}>
    <Grid data-aos="fade-right" item xs={12} sm={12} md={6} lg={6}>
      <Card img={Global} title={"Seamless Event Planning and Management"} details={"Effortlessly organize and manage university events with our smart system."} />
    </Grid>
    <Grid data-aos="fade-right" item xs={12} sm={12} md={6} lg={6}>
      <Card img={Speak} title={"Efficient Resource Booking and Allocation"} details={"Easily book classrooms, labs, and university resources in real-time."} />
    </Grid>
    <Grid data-aos="fade-right" item xs={12} sm={12} md={6} lg={6}>
      <Card img={Travelling} title={"Streamlined Approval Process for Requests"} details={"Get quick approvals for event venues, equipment, and other resources."} />
    </Grid>
    <Grid data-aos="fade-right" item xs={12} sm={12} md={6} lg={6}>
      <Card img={Friend} title={"Centralized Dashboard for Management"} details={"Monitor events, bookings, and resources all in one place."} />
    </Grid>
  </Grid>
</Box>

  );
}

function Card({ img, title, details }) {
  return (
    <Box>
      <Grid container>
        <Grid item xs={3}>
          <Box
            component="img"
            src={img}
            alt="Icon"
            sx={{
              width: "80%",
              height: "auto",
            }}
          />
        </Grid>
        <Grid item xs={8}>
          <Typography variant="h5" color="black" sx={{fontWeight:600}}>
          {title}
          </Typography>
          <Divider sx={{ my: 1, width: "75%" }} />
          <Typography variant="h6" color="grey" >
          {details}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default BenifitsCard;
