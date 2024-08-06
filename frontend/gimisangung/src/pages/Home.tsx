import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../reducer";
import { add, remove } from "../reducer/account";

import PrimaryBtn from "../components/BluePrimaryBtn";
import HomeNavbar from "../components/HomeNavBar";
import blankbox from "../assets/blankbox.png";
import docu from "../assets/document.png";
import PlusBtn from "../components/PlusBtn";
import Drawer from "../components/Drawer";
import Checkbox from "@mui/material/Checkbox";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionSharpIcon from "@mui/icons-material/DescriptionSharp";

import tmp from "../assets";

const serverURL = process.env.REACT_APP_SERVER_URL;
interface Contract {
  id: number;
  state: string;
  name: string;
  created_at: string;
  tags: string[];
}

interface Directory {
  id: number;
  name: string;
  created_at: string;
}

const StyledScreen = styled.div`
  background-color: #f8f8f8;
  height: 100vh;
  padding: 1rem;
  overflow-y: auto;
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
  padding: 0.1rem 0.5rem;
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
  width: 100%;
`;

const StyledH4 = styled.span`
  margin: 0;
  margin-top: 0.1rem;
  font-weight: bold;
  display: block;
`;
const StyledSpan = styled.span`
  margin: 0;
  margin-left: 0.2rem;
  font-size: 12px;
`;

const StyledCreatedAt = styled.p`
  margin: 0;
  font-size: 11px;
  color: #7b7b7b;
  padding-left: 0.3rem;
`;

const NewFolderIcon = styled(FolderIcon)`
  color: #ffff80;
`;

const TagWrapper = styled.div`
  margin: 0.2rem 0;
  display: flex;
`;

const Tag = styled.div`
  font-size: 12px;
  margin-left: 0.4rem;
  color: white;
  border-radius: 15px;
  padding: 0.1rem 0.3rem;
`;

const MoveBtnBar = styled.div`
  position: fixed;
  bottom: 0;
  background-color: white;
  height: 3rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.1rem 1rem;
`;

const MoveBtn = styled.button`
  background-color: #e6e6e6;
  border: 0.5px solid #cfcfcf;
  width: 6rem;
  height: 2rem;
  border-radius: 10px;
  margin-right: 1rem;
`;
const BtnWrapper = styled.div`
  width: auto;
`;

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [contractList, setContractList] = useState<Contract[]>([]);
  const [directoryList, setDirectoryList] = useState<Directory[]>([]);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedContracts, setSelectedContracts] = useState<Contract[]>([]);
  const [selectedDirectories, setSelectedDirectories] = useState<Directory[]>(
    []
  );
  const [checkDialog, setCheckDialog] = useState<boolean>(false);
  const colors = ["#1769AA", "#A31545", "#B2A429", "#008a05", "#34008e"];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { username, path, pathName } = useSelector(
    (state: RootState) => state.account
  );
  const [currentLocation, setCurrentLocation] = useState<number>(
    path[path.length - 1]
  );
  const [moveBtnVisible, setMoveBtnVisible] = useState<boolean>(false);
  const addContract = () => {
    navigate("/camera", { state: { currentLocation } });
  };

  const goResult = async (contractId: number) => {
    const res = await axios({
      method: "get",
      url: `${serverURL}/api/v1/contracts/${contractId}`,
    }).catch((err) => {
      console.log(err);
    });
    if (res) {
      navigate("/result", {
        state: {
          data: res.data,
        },
      });
    }
  };

  useEffect(() => {
    if (!drawerOpen && !moveBtnVisible) {
      setSelectedContracts([]);
      setSelectedDirectories([]);
    }
  }, [drawerOpen]);

  useEffect(() => {
    console.log("files please");
    if (checkDialog) {
      axios({
        method: "get",
        url: `${serverURL}/api/v1/directories/${currentLocation}/files`,
      })
        .then((res) => {
          setContractList(res.data.contracts);
          setDirectoryList(res.data.directories);
          setCheckDialog(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [checkDialog]);

  useEffect(() => {
    axios({
      method: "get",
      url: `${serverURL}/api/v1/directories/${currentLocation}/files`,
    })
      .then((res) => {
        setContractList(res.data.contracts);
        setDirectoryList(res.data.directories);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentLocation]);

  const handleTouchContractStart = (contract: Contract) => {
    const id = setTimeout(() => {
      setSelectedContracts([contract]);
      setMoveBtnVisible(false);
      setDrawerOpen(true);
    }, 1000);
    timeoutIdRef.current = id;
  };
  const handleTouchDirectoryStart = (directory: Directory) => {
    const id = setTimeout(() => {
      setSelectedDirectories([directory]);
      setMoveBtnVisible(false);
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

  const removePath = async (targetPath: number) => {
    const temp = path[targetPath];
    await dispatch(remove(targetPath));
    setCurrentLocation(temp);
  };

  const addPath = async (newPath: number, newPathName: string) => {
    await dispatch(add(newPath, newPathName));
    setCurrentLocation(newPath);
  };

  const cancelMove = () => {
    setMoveBtnVisible(false);
    setSelectedDirectories([]);
    setSelectedContracts([]);
  };

  const moveFiles = () => {
    selectedContracts.forEach((e) => {
      axios({
        method: "put",
        url: `${serverURL}/api/v1/contracts/${e.id}`,
        data: {
          name: e.name,
          tags: e.tags,
          parentId: currentLocation,
        },
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    });
    selectedDirectories.forEach((e) => {
      axios({
        method: "put",
        url: `${serverURL}/api/v1/directories/${e.id}`,
        data: {
          name: e.name,
          parentId: currentLocation,
        },
      })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    });
  };

  return (
    <div>
      <StyledScreen>
        <HomeNavbar />
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
            {path.map((e, idx) =>
              e === path[path.length - 1] ? (
                <span key={idx} onClick={() => removePath(idx)}>
                  {pathName[idx]}
                </span>
              ) : (
                <span key={idx} onClick={() => removePath(idx)}>
                  {pathName[idx]} {">"}
                </span>
              )
            )}
          </DirectoryPath>
          <PlusBtn
            currentLocation={currentLocation}
            checkDialog={checkDialog}
            setCheckDialog={setCheckDialog}
          />
        </MenuBar>
        {contractList.length > 0 || directoryList.length > 0 ? (
          <>
            {directoryList.map((directory) => (
              <ListItem
                key={directory.id}
                onClick={() => {
                  drawerOpen === true
                    ? selectContract(directory)
                    : addPath(directory.id, directory.name);
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
                  checked={selectedDirectories.includes(directory)}
                  style={{ display: drawerOpen ? "block" : "none" }}
                />
                <NewFolderIcon />
                <ListContentWrapper>
                  <h4>{directory.name}</h4>
                </ListContentWrapper>
              </ListItem>
            ))}
            {contractList.map((contract) => (
              <ListItem
                key={contract.id}
                onClick={() => {
                  drawerOpen === true
                    ? selectContract(contract)
                    : goResult(contract.id);
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
                  checked={selectedContracts.includes(contract)}
                  style={{ display: drawerOpen ? "block" : "none" }}
                />
                <DescriptionSharpIcon color="primary" />
                <ListContentWrapper>
                  <StyledH4>{contract.name}</StyledH4>
                  {contract.state === "done" ? (
                    <div>
                      <StyledCreatedAt>{contract.created_at}</StyledCreatedAt>
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
      </StyledScreen>
      <Drawer
        open={drawerOpen}
        toggleDrawer={setDrawerOpen}
        contracts={selectedContracts}
        directories={selectedDirectories}
        lengthOfList={selectedContracts.length + selectedDirectories.length}
        moveBtnVisible={moveBtnVisible}
        setMoveBtnVisible={setMoveBtnVisible}
      />
      <MoveBtnBar style={{ visibility: moveBtnVisible ? "visible" : "hidden" }}>
        <span>
          {selectedContracts.length + selectedDirectories.length}개 이동
        </span>
        <BtnWrapper>
          <MoveBtn onClick={cancelMove}>취 소</MoveBtn>
          <MoveBtn
            onClick={async () => {
              await moveFiles();
              cancelMove();
              axios({
                method: "get",
                url: `${serverURL}/api/v1/directories/${currentLocation}/files`,
              })
                .then((res) => {
                  setContractList(res.data.contracts);
                  setDirectoryList(res.data.directories);
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            여기로 이동
          </MoveBtn>
        </BtnWrapper>
      </MoveBtnBar>
    </div>
  );
};

export default Home;
