import React, { useState } from "react";
import { useEffect } from "react";
import PrimaryBtn from "../components/PrimaryBtn";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import blankbox from "../assets/blankbox.png";
import docu from "../assets/document.png";

const StyledScreen = styled.div`
  background-color: #f8f8f8;
  width: 100vw;
  height: 100vh;
  padding: 1rem;
`;

const BlankWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MenuBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const PlusBtn = styled.button`
  border: none;
  background-color: #f8f8f8;
`;

const StyledP = styled.p`
  margin: 3rem 0;
`;

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [docuList, setDocuList] = useState("");
  const addContract = () => {
    navigate("/camera");
  };
  useEffect(() => {
    console.log(1);
  });
  return (
    <StyledScreen>
      <Navbar></Navbar>
      <br />
      <h3>
        <img src={docu} alt="document" style={{ marginRight: "1vw" }} />
        계약서 목록
      </h3>
      <p>
        <span style={{ fontWeight: "bold" }}>김싸피</span>님! 안녕하세요!
      </p>
      <MenuBar>
        <div>asdf</div>
        <PlusBtn>1234</PlusBtn>
      </MenuBar>
      <BlankWrapper>
        <StyledP>계약서 목록이 비었어요!</StyledP>
        <img src={blankbox} alt="image" />
        <StyledP>계약서 추가 후 분석 결과를 받아보세요!</StyledP>
        <PrimaryBtn text="계약서 추가하기" addContract={addContract} />
      </BlankWrapper>
    </StyledScreen>
  );
};
export default Landing;
