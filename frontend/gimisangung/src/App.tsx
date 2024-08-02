import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import axios from "axios";
import Camera from "./pages/Camera";
import Result from "./pages/Result";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Login from "./pages/Login";
import Gallery from "./pages/Gallery";
import EditPage from "./pages/EditPage";
import Search from "./pages/Search";
// axios.defaults.withCredentials = true;

function App() {
  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/result" element={<Result />} />
            <Route path="/camera" element={<Camera />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/result" element={<Result />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/edit" element={<EditPage />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
