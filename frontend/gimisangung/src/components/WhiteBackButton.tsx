import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const StyledButton = styled.button`
  background-color: black;
  border: none;
  margin-bottom: 5px;
`;
const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <StyledButton
      onClick={() => {
        handleBack();
      }}
    >
      <ArrowBackIcon style={{ color: "white" }} />
    </StyledButton>
  );
};

export default BackButton;
