import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const StyledButton = styled.button`
  background-color: #f8f8f8;
  border: none;
  margin-bottom: 5px;
`;
const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <StyledButton
      onClick={() => {
        handleBack();
      }}
    >
      <ArrowBackIcon style={{ color: "black" }} />
    </StyledButton>
  );
};

export default BackButton;
