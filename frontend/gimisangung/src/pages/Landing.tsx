import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import landingimg from "../assets/landingimage.png";
import PrimaryBtn from "../components/BluePrimaryBtn";
import SkybluePrimaryBtn from "../components/SkybluePrimaryBtn";
import kakaoImg from "../assets/kakao_login_large_wide.png";
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

const KakaoBtn = styled.img`
  width: 80%;
  height: auto;
  margin-bottom: 1rem;
`;
const Landing = () => {
  const goLogin = () => {
    if (kakaoUrl) {
      window.location.href = kakaoUrl;
    }
  };
  return (
    <StyledScreen>
      <StyledImg src={landingimg} alt="landingimg" />
      <ButtonWrapper>
        <KakaoBtn src={kakaoImg} alt="kakaologin" onClick={goLogin} />
      </ButtonWrapper>
    </StyledScreen>
  );
};
export default Landing;
