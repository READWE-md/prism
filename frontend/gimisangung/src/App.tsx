import React from "react";
import styled from "styled-components";
import Container from "@mui/material/Container";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import NavBar from "./pages/NavBar";
import Landing from "./pages/Landing";
import Camera from "./pages/Camera";
import Result from "./pages/Result";
import { Routes, Route, BrowserRouter } from "react-router-dom";

const StyledContainer = styled(Container)`
  height: 100vh;
  width: 100vw;
  align-content: center;
  justify-content: center;
  background-color: #515151;
  max-width: 100vw !important;
  overflow-y: hidden;
`;

const Wrapper = styled.section`
  width: 360px;
  height: 800px;
  margin: auto;
  overflow: hidden;
`;

const BrowserWrapper = styled.div`
  background-color: white;
  height: 708px;
  padding: 10px;
  overflow-y: auto;
`;

function App() {
  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <StyledContainer>
          <Wrapper>
            <NavBar />
            <BrowserWrapper>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Landing></Landing>} />
                  <Route path="/camera" element={<Camera></Camera>} />
                  <Route path="/result" element={<Result></Result>} />
                </Routes>
              </BrowserRouter>
            </BrowserWrapper>
          </Wrapper>
        </StyledContainer>
      </div>
    </ThemeProvider>
  );
}

export default App;
