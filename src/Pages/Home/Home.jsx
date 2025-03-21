import React, { useEffect, useState } from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import TypoVariant from "../../Hooks/TypoResponsive/UseTypoResponsive";
import Image1 from "../../assets/Images/aranxa-esteve-S5DEUg2yUVU-unsplash.jpg";
import Image2 from "../../assets/Images/noiseporn-JNuKyKXLh8U-unsplash.jpg";
import Image3 from "../../assets/Images/teemu-paananen-bzdhc5b3Bxs-unsplash.jpg";
import Image4 from "../../assets/Images/drahomir-hugo-posteby-mach-n4y3eiQSIoc-unsplash.jpg";
import ImageList from "../../Components/ImageList/ImageList";
import QualityCard from "../../Components/Quality Count Card/QualityCard";
import BenifitsCard from "../../Components/Benefits Cards/BenifitsCard";
import { useSelector, useDispatch } from "react-redux";
import { showAlert } from "../../Utils/alertUtils";
import { setTokens } from "../../Reducers/authSlice";

import Aos from "aos";
import UserServices from "../../Services/UserService";
import Login from "../Login/Login";

const homeSlides = [
  { title: "Smart University Management System", img: Image1 },
  { title: "Effortless Event Planning & Scheduling", img: Image2 },
  { title: "Seamless Resource Booking & Approvals", img: Image3 },
  { title: "Enhancing Campus Efficiency & Productivity", img: Image4 },
];


function Home() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  const login = async () => {
    try {
      const response = await UserServices.userLogin({
        email: "kavishkasahandj@gmail.com",
        password: "Sahan@1234",
      });
      showAlert("error", "Operation successful!");
      dispatch(
        setTokens({
          accessToken: await response.data.token,
          refreshToken: await response.data.refreshToken,
        })
      );
    } catch (error) {
      console.error("Failed to fetch orders:", error.message);
    }
  };

  const testApi = async () => {
    const res = await UserServices.getOrders();
    console.log(res);
  };

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
                  width: "99%",
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
                  // backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='20 0 200 5' preserveAspectRatio='none'%3E%3Cpath d='M0,12 Q400,9 150,5 T200,9 T300,5' stroke='%230000FF' fill='none' stroke-width='1'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "100% 100%",
                },
              }}
            >
              Welcome to Smart Uni{" "}
              <Box component="span" sx={{ color: "primary.main" }}>
                System
              </Box>{" "}
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
              Our goal is to streamline event planning and resource management
              for universities. Managing events, classrooms, and resources
              efficiently is crucial, but many institutions face challenges due
              to outdated or manual processes. Our system simplifies scheduling,
              approvals, and bookings, ensuring seamless coordination for
              students, faculty, and administrators. Unlike traditional methods,
              our platform provides real-time availability, automated
              notifications, and centralized management, improving accessibility
              and efficiency. With an intuitive interface and modern technology,
              we empower universities to enhance productivity, reduce
              administrative burdens, and create a more organized academic
              environment.
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
                    // backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='20 0 200 5' preserveAspectRatio='none'%3E%3Cpath d='M0,12 Q400,9 150,5 T200,9 T300,5' stroke='%230000FF' fill='none' stroke-width='1'/%3E%3C/svg%3E")`,
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
                Why{" "}
                <Box component="span" sx={{ color: "primary.main" }}>
                  Us?
                </Box>{" "}
              </Typography>
            </Box>
            <Typography color="#757575" variant="h5" sx={{ fontWeight: "600" }}>
              Managing university events and resources efficiently can be
              challenging. Our system simplifies the process by offering a
              seamless platform for event planning, resource booking, and
              approval workflows. With real-time availability, automated
              notifications, and an intuitive interface, we help universities
              streamline operations, reduce administrative workload, and enhance
              overall productivity. Choose us for a smarter, more organized
              campus experience.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Home;
