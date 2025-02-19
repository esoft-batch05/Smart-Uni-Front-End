import React, { useEffect, useState } from "react";
import { Box, Divider, Grid, Typography } from "@mui/material";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import AOS from "aos";
import "aos/dist/aos.css";

function QualityCard() {
  const [startCount, setStartCount] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 1,
  });

  useEffect(() => {
    if (inView) {
      setStartCount(true);
    }
  }, [inView]);

  return (
    <Box
      sx={{ backgroundColor: "primary.lighter", borderRadius: "20px" }}
      p={4}
      ref={ref}
    >
      <Grid container spacing={2} display="flex" justifyContent="center">
        <Grid item xs={10} sm={8} md={4} lg={4} sx={{ mt: { sm: 3 } }}>
          <Typography variant="h2" color="primary.main">
            {startCount && <CountUp end={6} duration={5} />}+
          </Typography>
          <Divider sx={{ my: 1, width: "75%" }} />
          <Typography variant="h4" color="grey">
            International Instructors
          </Typography>
        </Grid>
        <Grid item xs={10} sm={8} md={4} lg={4} sx={{ mt: { sm: 3 } }}>
          <Typography variant="h2" color="primary.main">
            {startCount && <CountUp end={10} duration={5} />}+
          </Typography>
          <Divider sx={{ my: 1, width: "75%" }} />
          <Typography variant="h4" color="grey">
            Activities to Build Communication Skills
          </Typography>
        </Grid>
        <Grid item xs={10} sm={8} md={4} lg={4} sx={{ mt: { sm: 3 } }}>
          <Typography variant="h2" color="primary.main">
            {startCount && <CountUp end={30} duration={5} />}+
          </Typography>
          <Divider sx={{ my: 1, width: "75%" }} />
          <Typography variant="h4" color="grey">
            Interviews with English Instructors
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default QualityCard;
