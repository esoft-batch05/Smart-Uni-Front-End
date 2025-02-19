import { Box, Grid, Typography } from "@mui/material";
import React from "react";

function CourseFee() {
  return (
    <Box>
      <Grid
        container
        gap={1}
        sx={{ backgroundColor: "#D9D9D9", borderRadius: 2 }}
        p={3}
      >
        <Grid item xs={12} display="flex" justifyContent="center">
          <Typography variant="h4" color="black" sx={{ fontWeight: 600 }}>
            Course Fee
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          justifyContent="center"
          sx={{
            backgroundColor: "#D9D9D9",
            display: { xs: "block", sm: "flex" },
          }}
          gap={4}
        >
          <Box
            sx={{
              backgroundColor: "primary.darker",
              width: { xs: "100%", sm: "80%", md: "40%" },
              display: "grid",
              justifyContent: "center",
              textAlign:'center',
              padding: 1,
              borderRadius: 2,
              gap: 1,
              mt:{xs:1, sm:0}
            }}
          >
           
            <Typography variant="h5" color="white" sx={{ fontWeight: 500 }}>
              6000 LKR
            </Typography>
          </Box>
        </Grid>
        <Grid mt={1} item textAlign="center">
          <Typography variant="h7" color="grey">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem maiores
            ipsa nobis nam nemo saepe delectus, voluptates laudantium cum,
            assumenda porro? Saepe tempore sint animi. Distinctio quidem ipsa
            nobis nam nemo saepe delectus, voluptates laudantium cum, assumenda
            porro? Saepe tempore sint animi. Distinctio quidem
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CourseFee;
