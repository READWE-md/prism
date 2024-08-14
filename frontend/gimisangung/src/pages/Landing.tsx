import styled from "styled-components";
import landingimg from "../assets/landing_new_2.png";
import kakaoImg from "../assets/kakao_login_large_wide.png";

const ButtonWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const StyledImg = styled.img`
  margin-top: 20%;
  width: 100%;
  height: auto;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
`;

const ImgContainer = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
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
    <Container>
      <ImgContainer>
        <StyledImg src={landingimg} alt="landingimg" />
      </ImgContainer>
      <ButtonWrapper>
        <KakaoBtn src={kakaoImg} alt="kakaologin" onClick={goLogin} />
      </ButtonWrapper>
    </Container>
  );
};
export default Landing;
