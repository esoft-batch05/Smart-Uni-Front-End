import React, { useEffect } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import TypoVariant from "../../Hooks/TypoResponsive/UseTypoResponsive";
import Image1 from "../../assets/Images/Desktop - 1.png";
import Image2 from "../../assets/Images/Pool Table Girls.png";
import Image3 from "../../assets/Images/Coffe Shop.png";
import Image4 from "../../assets/Images/Beach Couple.png";
import Sub1 from "../../assets/Images/S1.png";
import Sub2 from "../../assets/Images/s2.png";
import Sub3 from "../../assets/Images/s3.png";
import Sub4 from "../../assets/Images/s4.png";
import ImageList from "../../Components/ImageList/ImageList";
import QualityCard from "../../Components/Quality Count Card/QualityCard";
import BenifitsCard from "../../Components/Benefits Cards/BenifitsCard";
import Footer from "../../Components/Footer/Footer";

import Aos from "aos";

const homeSlides = [
  { title: "International English Institute", img: Image1 },
  { title: "Expand Your Vocabulary", img: Image2 },
  { title: "Expand Your English Speaking", img: Image3 },
  { title: "Expand Your English Speaking", img: Image4 },
];

const HomeIntro = [];

function Home() {
  const variant = TypoVariant();

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <>
      <Box
        sx={{
          position: "relative",
          height: { xs: "60vh", sm: "65vh", md: "75vh", lg: "80vh" },
          overflow: "hidden",
        }}
      >
        <Carousel animation="fade" interval={5000} indicators={false}>
          {homeSlides.map((slide, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                height: { xs: "60vh", sm: "65vh", md: "75vh", lg: "80vh" },
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `
          linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%),
          url(${slide.img})
        `,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "40%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 3,
                  width: "100%",
                  textAlign: "start",
                  padding: "0 16px",
                  "@keyframes lineLoop": {
                    "0%": {
                      transform: "scaleX(0)",
                      transformOrigin: "left",
                    },
                    "50%": {
                      transform: "scaleX(0.5)",
                      transformOrigin: "left",
                    },
                    "100%": {
                      transform: "scaleX(0)",
                      transformOrigin: "right",
                    },
                  },
                }}
              >
                <Grid container>
                  <Grid item xs={4} data-aos="fade-right">
                    <Typography
                      variant="h2"
                      color="primary.lighter"
                      sx={{
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          bottom: -8, // Adjust as needed to position the line
                          width: "100%",
                          height: 4, // Height of the line
                          backgroundColor: "primary.main", // Color of the line
                          animation: "lineLoop 2s infinite",
                        },
                      }}
                    >
                      {slide.title}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          ))}
        </Carousel>
      </Box>

      <Container maxWidth="xl">
        <Grid
          container
          spacing={5}
          mt={3}
          sx={{
            marginTop: { xs: "16px", sm: "24px", md: "32px" }, // Responsive margin-top
            backgroundColor: "primary.lighter", // Optional: Background color
            borderRadius: "20px", // Optional: Rounded corners
          }}
          p={2}
        >
          <Grid
            data-aos="fade-up"
            item
            xs={12}
            textAlign="start"
            justifyContent="start"
            display="flex"
            sx={{ position: "relative" }}
          >
            <Typography
              color="black"
              variant="h2"
              sx={{
                fontWeight: "600",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  left: { lg: "-70px", md: "-65px", sm: "-50px", xs: "-30px" },
                  bottom: "-15px",
                  width: "100%",
                  height: "20px",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='20 0 200 5' preserveAspectRatio='none'%3E%3Cpath d='M0,12 Q400,9 150,5 T200,9 T300,5' stroke='%230000FF' fill='none' stroke-width='1'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "100% 100%",
                },
              }}
            >
              Welcome to International{" "}
              <Box component="span" sx={{ color: "primary.main" }}>
                English
              </Box>{" "}
              Institute{" "}
            </Typography>
          </Grid>
          <Grid
            data-aos="fade-up"
            item
            mt={2}
            xs={12}
            md={12}
            sm={12}
            lg={6}
            p={2}
            textAlign="start"
            justifyContent="start"
            display="flex"
          >
            <Typography color="#757575" variant="h5" sx={{ fontWeight: "600" }}>
              Our goal is to help Sri Lankan students improve their English
              skills. English is essential for success, but many students find
              it difficult to master, even after years of study. This is often
              because they don’t get enough practice or aren’t in the right
              environment to learn. We’ve created a course that focuses on
              understanding and thinking in English, rather than just speaking,
              reading, or writing. This makes us different from other programs.
              Our young, international instructors bring fresh ideas and help
              students connect with the world. Through our course, students will
              not only become better at English but also gain confidence, create
              new opportunities, and build global connections.
            </Typography>
          </Grid>
          <Grid
            data-aos="fade-up"
            item
            xs={12}
            md={12}
            lg={6}
            mt={1}
            sm={12}
            p={2}
            textAlign="start"
            justifyContent="start"
            display="flex"
          >
            <Carousel
              animation="fade"
              interval={3000}
              indicators={false}
              sx={{ width: "100%", height: "100%" }}
            >
              {homeSlides.map((slide, index) => (
                <Box
                  key={index}
                  sx={{
                    width: "auto",
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  
                  <Box
                    component="img"
                    src={slide?.img} 
                    
                    sx={{
                      width: "auto",
                      height: {
                        xs: "40vh",
                        sm: "35vh",
                        md: "45vh",
                        lg: "40vh",
                      },
                      objectFit: "cover",
                    }}
                  />
                </Box>
              ))}
            </Carousel>
          </Grid>
        </Grid>
        <Box mt={10}>
          <Grid container>
            <Grid
              data-aos="fade-up"
              item
              xs={12}
              md={8}
              lg={3}
              sm={8}
              display="flex"
              justifyContent="center"
            >
              <Typography
                color="black"
                variant="h3"
                sx={{
                  fontWeight: "600",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    left: {
                      lg: "-20px",
                      md: "-50px",
                      sm: "-30px",
                      xs: "-28px",
                    },
                    bottom: "-15px",
                    width: "100%",
                    height: "20px",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='20 0 200 5' preserveAspectRatio='none'%3E%3Cpath d='M0,12 Q400,9 150,5 T200,9 T300,5' stroke='%230000FF' fill='none' stroke-width='1'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% 100%",
                  },
                }}
              >
                Our{""}
                <Box component="span" sx={{ color: "primary.main" }}>
                  &nbsp; Achievements
                </Box>{" "}
              </Typography>
            </Grid>
            <Grid
              data-aos="fade-up"
              item
              display="flex"
              justifyContent="center"
              xs={12}
              mt={8}
            >
              <QualityCard />
            </Grid>
          </Grid>
        </Box>
        <Box mt={10} p={3}>
          <Grid container display="flex" justifyContent="center">
            <Grid item xs={12}>
              <Typography
                color="black"
                variant="h3"
                sx={{
                  fontWeight: "600",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    left: {
                      lg: "-50px",
                      md: "-50px",
                      sm: "-50px",
                      xs: "-28px",
                    },
                    bottom: "-15px",
                    width: "50%",
                    height: "20px",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='20 0 200 5' preserveAspectRatio='none'%3E%3Cpath d='M0,12 Q400,9 150,5 T200,9 T300,5' stroke='%230000FF' fill='none' stroke-width='1'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% 100%",
                  },
                }}
              >
                What You’ll{" "}
                <Box component="span" sx={{ color: "primary.main" }}>
                  Achieve with Us
                </Box>{" "}
              </Typography>
            </Grid>
            <Grid item xs={10} mt={10}>
              <BenifitsCard />
            </Grid>
          </Grid>
        </Box>
        <Grid
          container
          spacing={5}
          mt={3}
          sx={{
            marginTop: { xs: "16px", sm: "24px", md: "32px" },
            borderRadius: "20px",
          }}
          p={2}
        >
          <Grid
            data-aos="fade-up"
            item
            xs={12}
            lg={6}
            md={12}
            sm={12}
            mt={2}
            p={2}
            display="flex"
            justifyContent="start"
            textAlign="start"
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Carousel
                animation="fade"
                interval={3000}
                indicators={false}
                sx={{ width: "100%", height: "100%" }}
              >
                {homeSlides.map((slide, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: "auto",
                      height: "100%",
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: "8px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      component="img"
                      src={slide?.img}
                      alt={slide.title}
                      sx={{
                        width: "auto",
                        height: {
                          xs: "40vh",
                          sm: "35vh",
                          md: "45vh",
                          lg: "40vh",
                        },
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                ))}
              </Carousel>
            </Box>
          </Grid>
          <Grid
            data-aos="fade-up"
            item
            mt={2}
            xs={12}
            lg={6}
            md={12}
            sm={12}
            p={2}
            textAlign="start"
            display="flex"
            flexDirection="column"
            justifyContent="start"
          >
            <Box mb={3}>
              <Typography
                color="black"
                variant="h3"
                sx={{
                  fontWeight: "600",
                  position: "relative",
                }}
              >
                Why is English{" "}
                <Box component="span" sx={{ color: "primary.main" }}>
                  Important?
                </Box>{" "}
              </Typography>
            </Box>
            <Typography color="#757575" variant="h5" sx={{ fontWeight: "600" }}>
              English is a global language that opens doors to countless
              opportunities in education, careers, and communication worldwide.
              For Sri Lankan students, mastering English is essential not only
              for academic success but also for building confidence in a world
              where English is the bridge for connecting with people from
              different countries. By learning English, students in Sri Lanka
              can access a wealth of knowledge, engage in international
              dialogues, and pursue global careers, helping them to succeed both
              locally and globally.
            </Typography>
          </Grid>
        </Grid>
      </Container>
      <Box>
        <Footer />
      </Box>
    </>
  );
}

export default Home;
