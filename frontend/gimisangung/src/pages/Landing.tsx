import type { FC } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import styled from "styled-components";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";

const CameraButton = styled(Button)`
  padding: 3rem !important;
  font-size: 20px !important;
  font-weight: bold !important;
  flex-direction: column !important;
  margin-top: 60% !important;
`;

const StyledContainer = styled(Container)`
  height: 100%;
  text-align: center;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center;
`;

const StyledP = styled.p`
  margin-bottom: 0px;
`;

const EtcP = styled.p`
  margin-top: auto;
  margin-bottom: 1rem;
`;

const PdfButton = styled(Button)`
  padding: 1rem !important;
  margin-bottom: 2rem !important;
`;

const CameraIcon = styled(CameraAltOutlinedIcon)`
  font-size: 50px !important;
`;

const PdfIcon = styled(PictureAsPdfOutlinedIcon)`
  margin-right: 5px;
`;

const Landing: FC = () => {
  const navigate = useNavigate();
  return (
    <StyledContainer>
      <CameraButton
        variant="outlined"
        onClick={() => {
          navigate("/camera");
        }}
      >
        <CameraIcon />
        <StyledP>사진 찍어서 계약서 </StyledP>
        <StyledP>분석 시작하기</StyledP>
      </CameraButton>
      <EtcP>그 밖에...</EtcP>
      <PdfButton variant="outlined">
        <PdfIcon />
        pdf로 분석하기
      </PdfButton>
    </StyledContainer>
  );
};
export default Landing;
