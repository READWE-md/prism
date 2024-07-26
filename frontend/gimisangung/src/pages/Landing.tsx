import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import landingimg from "../assets/landingimage.png";
import { Container } from "@mui/material";
import PrimaryBtn from "../components/PrimaryBtn";
import SkybluePrimaryBtn from "../components/SkybluePrimaryBtn";

const StyledContainer = styled(Container)`
  height: 100vh;
  text-align: center;
  padding-bottom: 4rem;
  margin-top: 1rem;
  display: flex;
  align-content: end;
`;

const ButtonWrapper = styled.div`
  margin-top: 1rem;
`;

const StyledImg = styled.img`
  margin-bottom: 10rem;
`;

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const goLogin = () => {
    navigate("/home");
  };
  const goSignIn = () => {
    navigate("/home");
  };
  return (
    <StyledContainer>
      <StyledImg src={landingimg} alt="landingimg" />
      <ButtonWrapper>
        <PrimaryBtn text="로그인" onclick={goLogin}></PrimaryBtn>
      </ButtonWrapper>
      <ButtonWrapper>
        <SkybluePrimaryBtn
          text="회원가입"
          onclick={goSignIn}
        ></SkybluePrimaryBtn>
      </ButtonWrapper>
    </StyledContainer>
  );
};
export default Landing;
