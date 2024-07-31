import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import PrimaryBtn from "../components/BluePrimaryBtn";
import Navbar from "../components/NavBar";
import blankbox from "../assets/blankbox.png";
import docu from "../assets/document.png";
import PlusBtn from "../components/PlusBtn";
import Drawer from "../components/Drawer";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";

import tmp from "../assets";

interface Contract {
  id: string;
  title: string;
  file_path: string;
  created_at: string;
}

interface Directory {
  id: string;
  title: string;
  created_at: string;
}

// "directories": [
// 		{
// 			"id": "디렉토리 ID",
// 			"title": "디렉토리 명",
// 			"created_at": "1374490205",
// 		}
// 	],
// 	"contracts": [
// 		{
// 			"id": "계약서 ID",
// 			"status": "fail/upload/analyze/done"
// 			"title": "title of your contract",
// 			"created_at": "1374490205",
// 			"start_date": "1374490205",
// 			"expire_date": "1374890205",
// 			"tags":["태그a", "태그b", "태그c"]
// 		}
// 	]

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
  display: flex;
  align-items: center;
`;

const DirectoryPath = styled.div`
  font-weight: bold;
  text-decoration: underline;
  text-underline-offset: 0.2rem;
`;

const Home = () => {
  const navigate = useNavigate();
  const [contractList, setContractList] = useState<Contract[]>([]);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedContracts, setSelectedContracts] = useState<Contract[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
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
    if (!drawerOpen) {
      setSelectedContracts([]);
    }
  }, [drawerOpen]);

  useEffect(() => {
    // try {
    //   const response = axios.get("/api/v1/directories/{currentDirectoryId}"),
    //     {
    //       name,
    //       parentId,
    //     };
    //   navigate("/home");
    // } catch (error) {
    //   console.log(error);
    // }
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

  const handleTouchStart = (contract: Contract) => {
    const id = setTimeout(() => {
      setSelectedContracts((prevContracts) => [...prevContracts, contract]);

      setDrawerOpen(true);
    }, 1000);
    timeoutIdRef.current = id;
  };

  const handleTouchEnd = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
  };

  const selectContract = (contract: Contract) => {
    if (selectedContracts.some((c) => c.id === contract.id)) {
      setSelectedContracts((prevContracts) =>
        prevContracts.filter((c) => c.id !== contract.id)
      );
    } else {
      setSelectedContracts((prevContracts) => [...prevContracts, contract]);
    }
  };

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
          <ListItem
            key={contract.id}
            onClick={() => {
              drawerOpen === true ? selectContract(contract) : goResult();
            }}
            onTouchStart={() => handleTouchStart(contract)}
            onTouchEnd={() => handleTouchEnd()}
            style={{
              backgroundColor: selectedContracts.includes(contract)
                ? "#CFCFCF"
                : "white",
            }}
          >
            <Checkbox
              id={contract.id}
              checked={selectedContracts.includes(contract) ? true : false}
              style={{ display: drawerOpen ? "block" : "none" }}
            />
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
      <Drawer
        open={drawerOpen}
        toggleDrawer={setDrawerOpen}
        contracts={selectedContracts}
        lengthOfList={selectedContracts.length}
      />
    </StyledScreen>
  );
};

export default Home;
