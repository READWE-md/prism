import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import PrimaryBtn from "../components/PrimaryBtn";
import Navbar from "./NavBar";
import blankbox from "../assets/blankbox.png";
import docu from "../assets/document.png";
import PlusBtn from "../components/PlusBtn";

import tmp from "../assets";

interface Contract {
  id: string;
  title: string;
  file_path: string;
  created_at: string;
}

const StyledScreen = styled.div`
  background-color: #f8f8f8;
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

const StyledP = styled.p`
  margin: 3rem 0;
`;

const ListItem = styled.div`
  background-color: white;
  padding: 1px 6px;
  margin-bottom: 1rem;
  border-radius: 20px;
`;

const DirectoryPath = styled.div`
  font-weight: bold;
  text-decoration: underline;
  text-underline-offset: 0.2rem;
`;

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [contractList, setContractList] = useState<Contract[]>([]);

  const addContract = () => {
    navigate("/camera");
  };

  const goResult = () => {
    navigate("/result", {
      state: {
        data: tmp,
      },
    });
  };

  useEffect(() => {
    const initialContracts: Contract[] = [
      {
        id: "1",
        title: "임원에 대한 근로계약서",
        file_path: "link/to/your/file.pdf",
        created_at: "20240201",
      },
      {
        id: "2",
        title: "임원 근로계약서",
        file_path: "link/to/your/file.pdf",
        created_at: "20240205",
      },
    ];
    setContractList(initialContracts);
  }, []);

  return (
    <StyledScreen>
      <Navbar />
      <br />
      <h3>
        <img src={docu} alt="document" style={{ marginRight: "1vw" }} />
        계약서 목록
      </h3>
      <p>
        <span style={{ fontWeight: "bold" }}>김싸피</span>님! 안녕하세요!
      </p>
      <MenuBar>
        <DirectoryPath>
          <span>하도급</span> &gt; <span>근로</span>
        </DirectoryPath>
        <PlusBtn />
      </MenuBar>
      {contractList.length > 0 ? (
        contractList.map((contract) => (
          <ListItem key={contract.id} onClick={goResult}>
            <h4>{contract.title}</h4>
          </ListItem>
        ))
      ) : (
        <BlankWrapper>
          <StyledP>계약서 목록이 비었어요!</StyledP>
          <img src={blankbox} alt="image" />
          <StyledP>계약서 추가 후 분석 결과를 받아보세요!</StyledP>
          <PrimaryBtn text="계약서 추가하기" onclick={addContract} />
        </BlankWrapper>
      )}
    </StyledScreen>
  );
};

export default Landing;
