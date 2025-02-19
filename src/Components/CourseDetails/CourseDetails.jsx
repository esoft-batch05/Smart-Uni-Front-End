import { Box, Divider, Grid, Typography } from "@mui/material";
import React from "react";

function CourseDetails({ img, title, details }) {
  return (
    <Box>
      <Grid container>
        <Grid xs={12} md={4} item display="flex" justifyContent="center">
          <Box
            component="img"
            src={img}
            alt="img"
            sx={{
              width: {xs:"100%", sm:"80%"},
              borderRadius: 2,
              height: {
                xs: "55vh",
                sm: "35vh",
                md: "35vh",
                lg: "35vh",
              },
              objectFit: "cover",
            }}
          />
        </Grid>
        <Grid
          xs={12}
          md={8}
          sx={{
            mt: { xs: 5, sm:5, md:0 },
          }}
          item
          display="block"
          justifyContent="center"
        >
          <Typography variant="h5" color="black" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Divider sx={{ my: 1, width: "75%" }} />
          <Typography variant="h6" color="grey">
            {details}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CourseDetails;
