import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  background-color: #0064ff;
  border-radius: 20px;
  height: 60px;
  width: 310px;
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
  addContract: () => void;
}

const PrimaryBtn: React.FC<PrimaryBtnProps> = ({ text, addContract }) => {
  return (
    <StyledButton className="rectangle" onClick={addContract}>
      {text}
    </StyledButton>
  );
};

export default PrimaryBtn;
