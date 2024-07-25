import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Camera from "./pages/Camera";
import Result from "./pages/Result";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import { Routes, Route, BrowserRouter } from "react-router-dom";

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
            <Route path="/result" element={<Result />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
