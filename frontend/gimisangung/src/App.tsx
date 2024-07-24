import React from "react";
import styled from "styled-components";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Camera from "./pages/Camera";
import Normal from "./pages/Normal";
import Result from "./pages/Result";
import Landing from "./pages/Landing";
import { Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            {/* <Route element={<Normal />}>
              <Route path="/" element={<Landing />} />
              <Route path="/result" element={<Result />} />
              </Route> */}
            <Route path="/" element={<Landing />} />
            <Route path="/camera" element={<Camera />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
