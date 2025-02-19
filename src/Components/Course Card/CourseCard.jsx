import { Box, Divider, Grid, Typography } from "@mui/material";
import Global from "../../assets/Icon/global.png";
import Speak from "../../assets/Icon/speak.png";
import Travelling from "../../assets/Icon/travel-bag.png";
import Friend from "../../assets/Icon/friends.png";
import React, { useEffect } from "react";
import Aos from "aos";

function CourseCard({img, title, details}) {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <Box display="flex" justifyContent="center">
      <Grid container>
        <Grid data-aos="fade-right" item>
          <Card img={img} title={title} details={details} />
        </Grid>
      </Grid>
    </Box>
  );
}

function Card({ img, title, details }) {
  return (
    <Box>
      <Grid container>
        <Grid item xs={12} display="flex" justifyContent="center">
          <Box
            component="img"
            src={img}
            alt="Icon"
            sx={{
              width: "40%",
              height: "auto",
            }}
          />
        </Grid>
      </Grid>
      <Box mt={3}>
        <Typography textAlign='center'   variant="h5" color="black" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography textAlign='center'>
           {details}
        </Typography>
      </Box>
    </Box>
  );
}

export default CourseCard;
