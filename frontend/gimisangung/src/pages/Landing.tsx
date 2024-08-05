import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import landingimg from "../assets/landingimage.png";
import PrimaryBtn from "../components/BluePrimaryBtn";
import SkybluePrimaryBtn from "../components/SkybluePrimaryBtn";

const StyledScreen = styled.div`
  background-color: #f8f8f8;
  height: 100vh;
  align-content: end;
  text-align: center;
`;

const ButtonWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const StyledImg = styled.img`
  margin-bottom: 30%;
`;

const kakaoUrl = process.env.REACT_APP_KAKAO_AUTH_URL;

const Landing = () => {
  const navigate = useNavigate();
  const goLogin = () => {
    navigate("/login");
  };
  const goSignIn = () => {
    navigate("/signin");
  };
  return (
    <StyledScreen>
      <StyledImg src={landingimg} alt="landingimg" />
      <a href={kakaoUrl}>kakaologin</a>
      <ButtonWrapper>
        <PrimaryBtn text="로그인" onclick={goLogin}></PrimaryBtn>
      </ButtonWrapper>
      <ButtonWrapper>
        <SkybluePrimaryBtn
          text="회원가입"
          onclick={goSignIn}
        ></SkybluePrimaryBtn>
      </ButtonWrapper>
    </StyledScreen>
  );
};
export default Landing;
