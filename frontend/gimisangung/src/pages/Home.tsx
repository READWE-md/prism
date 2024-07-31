import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import PrimaryBtn from "../components/BluePrimaryBtn";
import Navbar from "../components/NavBar";
import blankbox from "../assets/blankbox.png";
import docu from "../assets/document.png";
import PlusBtn from "../components/PlusBtn";
import Drawer from "../components/Drawer";
import Checkbox from "@mui/material/Checkbox";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionSharpIcon from "@mui/icons-material/DescriptionSharp";

import tmp from "../assets";

interface Contract {
  id: string;
  state: string;
  title: string;
  created_at: string;
  start_date: string;
  expire_date: string;
  tags: string[];
}

interface Directory {
  id: string;
  title: string;
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
  display: flex;
  align-items: center;
  height: 4.5rem;
`;

const DirectoryPath = styled.div`
  font-weight: bold;
  text-decoration: underline;
  text-underline-offset: 0.2rem;
`;

const ListContentWrapper = styled.div`
  margin-left: 3%;
`;

const StyledH4 = styled.h4`
  margin: 0;
  margin-top: 3px;
`;
const StyledSpan = styled.span`
  margin: 0;
  margin-left: 0.2rem;
  font-size: 12px;
`;

const NewFolderIcon = styled(FolderIcon)`
  color: #ffff80;
`;

const TagWrapper = styled.div`
  margin: 0;
  display: flex;
`;

const Tag = styled.div`
  font-size: 12px;
  margin-left: 0.4rem;
  color: white;
  border-radius: 15px;
  padding: 0.1rem 0.3rem;
`;

const Home = () => {
  const navigate = useNavigate();

  // const { state } = useLocation();
  const state = { username: "test", currentLocation: 1, current: [1] };

  const [contractList, setContractList] = useState<Contract[]>([]);
  const [directoryList, setDirectoryList] = useState<Directory[]>([]);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedContracts, setSelectedContracts] = useState<Contract[]>([]);
  const [selectedDirectories, setSelectedDirectories] = useState<Directory[]>(
    []
  );
  const colors = ["#1769AA", "#A31545", "#B2A429", "#008a05", "#34008e"];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const username = state.username;
  const currentLocation: number = state.current[state.current.length - 1];
  const addContract = () => {
    navigate("/camera", { state: { currentLocation } });
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
      setSelectedDirectories([]);
    }
  }, [drawerOpen]);

  useEffect(() => {
    axios({
      method: "get",
      url: `http://127.0.0.1:8080/api/v1/directories/${currentLocation}`,
    })
      .then((res) => {
        setContractList(res.data.contracts);
        setDirectoryList(res.data.directories);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleTouchContractStart = (contract: Contract) => {
    const id = setTimeout(() => {
      setSelectedContracts((prevContracts) => [...prevContracts, contract]);

      setDrawerOpen(true);
    }, 1000);
    timeoutIdRef.current = id;
  };
  const handleTouchDirectoryStart = (directory: Directory) => {
    const id = setTimeout(() => {
      setSelectedDirectories((prevDirectories) => [
        ...prevDirectories,
        directory,
      ]);

      setDrawerOpen(true);
    }, 1000);
    timeoutIdRef.current = id;
  };

  const handleTouchEnd = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
  };

  const selectContract = (item: Contract | Directory) => {
    if ("state" in item) {
      const contract = item as Contract;
      if (selectedContracts.some((c) => c.id === contract.id)) {
        setSelectedContracts((prevContracts) =>
          prevContracts.filter((c) => c.id !== contract.id)
        );
      } else {
        setSelectedContracts((prevContracts) => [...prevContracts, item]);
      }
    } else {
      const directory = item as Directory;
      if (selectedDirectories.some((c) => c.id === directory.id)) {
        setSelectedDirectories((prevDirectories) =>
          prevDirectories.filter((c) => c.id !== directory.id)
        );
      } else {
        setSelectedDirectories((prevDirectories) => [
          ...prevDirectories,
          directory,
        ]);
      }
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
        <span style={{ fontWeight: "bold" }}>{username}</span>님! 안녕하세요!
      </p>
      <MenuBar>
        <DirectoryPath>
          <span>하도급</span> &gt; <span>근로</span>
        </DirectoryPath>
        <PlusBtn currentLocation={currentLocation} />
      </MenuBar>
      {contractList.length > 0 || directoryList.length > 0 ? (
        <>
          {directoryList.map((directory) => (
            <ListItem
              key={directory.id}
              onClick={() => {
                drawerOpen === true
                  ? selectContract(directory)
                  : navigate("/home");
              }}
              onTouchStart={() => handleTouchDirectoryStart(directory)}
              onTouchEnd={() => handleTouchEnd()}
              style={{
                backgroundColor: selectedDirectories.includes(directory)
                  ? "#CFCFCF"
                  : "white",
              }}
            >
              <Checkbox
                id={directory.id}
                checked={selectedDirectories.includes(directory)}
                style={{ display: drawerOpen ? "block" : "none" }}
              />
              <NewFolderIcon />
              <ListContentWrapper>
                <h4>{directory.title}</h4>
              </ListContentWrapper>
            </ListItem>
          ))}
          {contractList.map((contract) => (
            <ListItem
              key={contract.id}
              onClick={() => {
                drawerOpen === true ? selectContract(contract) : goResult();
              }}
              onTouchStart={() => handleTouchContractStart(contract)}
              onTouchEnd={() => handleTouchEnd()}
              style={{
                backgroundColor: selectedContracts.includes(contract)
                  ? "#CFCFCF"
                  : "white",
                opacity:
                  contract.state === "analyze" || contract.state === "upload"
                    ? "50%"
                    : "100%",
                border: contract.state === "fail" ? "1px solid red" : "none",
              }}
            >
              <Checkbox
                id={contract.id}
                checked={selectedContracts.includes(contract)}
                style={{ display: drawerOpen ? "block" : "none" }}
              />
              <DescriptionSharpIcon color="primary" />
              <ListContentWrapper>
                <StyledH4>{contract.title}</StyledH4>
                {contract.state === "done" ? (
                  <div>
                    <StyledSpan>
                      {contract.start_date} ~ {contract.expire_date}
                    </StyledSpan>
                    <TagWrapper>
                      {contract.tags.map((tag, idx) => (
                        <Tag
                          key={tag}
                          style={{
                            backgroundColor: colors[idx % colors.length],
                          }}
                        >
                          #{tag}
                        </Tag>
                      ))}
                    </TagWrapper>
                  </div>
                ) : contract.state === "analyze" ? (
                  <StyledSpan>분석중</StyledSpan>
                ) : contract.state === "upload" ? (
                  <StyledSpan>업로드중</StyledSpan>
                ) : (
                  <StyledSpan style={{ color: "red" }}>
                    분석에 실패하였습니다.
                  </StyledSpan>
                )}
              </ListContentWrapper>
            </ListItem>
          ))}
        </>
      ) : (
        <BlankWrapper>
          <StyledP>계약서 목록이 비었어요!</StyledP>
          <img src={blankbox} alt="image1" />
          <StyledP>계약서 추가 후 분석 결과를 받아보세요!</StyledP>
          <PrimaryBtn text="계약서 추가하기" onclick={addContract} />
        </BlankWrapper>
      )}
      <Drawer
        open={drawerOpen}
        toggleDrawer={setDrawerOpen}
        contracts={selectedContracts}
        directories={selectedDirectories}
        lengthOfList={selectedContracts.length + selectedDirectories.length}
      />
    </StyledScreen>
  );
};

export default Home;
