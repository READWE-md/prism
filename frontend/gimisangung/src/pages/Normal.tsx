import React from "react";
import styled from "styled-components";
import Container from "@mui/material/Container";
import NavBar from "./NavBar";
import Landing from "./Home";
import Result from "./Result";
import { Outlet } from "react-router-dom";

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

const Normal: React.FC = () => {
  return (
    <StyledContainer>
      <Wrapper>
        <NavBar />
        <BrowserWrapper>
          <Outlet></Outlet>
        </BrowserWrapper>
      </Wrapper>
    </StyledContainer>
  );
};

export default Normal;
