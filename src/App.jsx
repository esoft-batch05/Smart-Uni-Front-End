import { useState, useEffect } from "react";
import NavBar from "./Layout/Nav-Bar/NavBar";
import ThemeProvider from "./theme/index";
import Home from "./Pages/Home/Home";
import Image1 from "../src/assets/Images/excited-teen-girl-showing-tablet-boyfriend.jpg";
import Image2 from "../src/assets/Images/free-time-students-bachelor-s-campus-life-rhythm-five-friendly-students-are-walking.jpg";
import { Box, Fade } from "@mui/material";
import Router from "./Routes/Section";
import { BrowserRouter } from "react-router-dom";
import WhatsAppButton from "./Components/Whatsapp-Service/Whatsapp";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <WhatsAppButton />
        <Router />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
