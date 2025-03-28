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
import { Provider } from "react-redux";
import store from "../src/app/store";
import AlertSystem from "./Components/Alert/AlertSystem";
import Loading from "./Components/Loadnig Animation/loading";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <AlertSystem />
          <Loading />
          <Router />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
