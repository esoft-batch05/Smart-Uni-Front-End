import { Box, Grid, Typography, keyframes } from "@mui/material";
import React from "react";
import TypoVariant from '../../Hooks/TypoResponsive/UseTypoResponsive'

function ImageSlider({title, img}) {
  const variant = TypoVariant();
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: "60vh", sm: "60vh", md: "80vh" },
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `
          linear-gradient(0deg, rgba(44, 62, 80, 0) 37%,#C5DEF4 99%),
          url(${img})
        `,
          backgroundSize: { xs: "200%", sm: "100%", md: "100%" },
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <Box
        mt={15}
        p={3}
        display={"flex"}
        justifyContent={"center"}
        sx={{ position: "relative", zIndex: 3 }}
      >
        <Typography
          textAlign={"center"}
          sx={{
            textShadow: "6px 5px 12px rgba(0, 0, 1, 1)",
          }}
          variant={variant}
          color="primary.lighter"
        >
          {title}
        </Typography>
      </Box>
    </Box>
  );
}

export default ImageSlider;
