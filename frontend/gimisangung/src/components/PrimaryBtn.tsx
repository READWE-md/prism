import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  background-color: #0064ff;
  border-radius: 20px;
  height: 4rem;
  width: 75%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 18px;
`;

interface PrimaryBtnProps {
  text: string;
  onclick: () => void;
}

const PrimaryBtn: React.FC<PrimaryBtnProps> = ({ text, onclick }) => {
  return (
    <StyledButton className="rectangle" onClick={onclick}>
      {text}
    </StyledButton>
  );
};

export default PrimaryBtn;
