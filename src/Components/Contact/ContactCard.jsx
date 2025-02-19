import { Box, Divider, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Aos from "aos";

function ContactCard({ img, title, detail }) {  // Destructure props here
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <Box mb={5} display="flex" justifyContent="center">
      <Grid container spacing={10}>
        <Grid data-aos="fade-right" item xs={12}>
          <Card img={img} title={title} detail={detail} />
        </Grid>
      </Grid>
    </Box>
  );
}

function Card({ img, title, detail }) {
  return (
    <Box>
      <Grid container alignItems="center" gap={5}>
        <Grid item xs={1} display='flex' justifyContent='center' alignItems='center'>
          <Box
            component="img"
            src={img}
            alt="Icon"
            sx={{
              width: "100%",
              height: "auto",  // Maintain aspect ratio
            }}
          />
        </Grid>
        <Grid item xs={8}>
          <Typography variant="h5" color="black" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Divider sx={{ my: 1, width: "75%" }} />
          <Typography variant="h6" color="grey">
            {detail}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ContactCard;
