import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../reducer";
import { add, remove } from "../reducer/account";
import ContractListItem from "../components/ContractListItem";

import { Card, Stack, Box, Typography } from "@mui/material";
import BottomNavigationBar from "../components/BottomNavigationBar";
import PrimaryBtn from "../components/BluePrimaryBtn";
import blankbox from "../assets/blankbox.png";
import Drawer from "../components/Drawer";
import AddDialog from "../components/AddDialog";
import Checkbox from "@mui/material/Checkbox";
import FolderIcon from "@mui/icons-material/Folder";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CircularProgress } from "@mui/material";
import PlusBtn from "../components/PlusBtn";

const serverURL = process.env.REACT_APP_SERVER_URL;

interface Contract {
  id: number;
  status: string;
  name: string;
  viewedAt: string;
  startDate: string | null;
  expireDate: string | null;
  tags: string[];
  parentId: number;
}

interface Directory {
  id: number;
  name: string;
  created_at: string;
}

const Container = styled.div`
  min-height: 100%;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
  padding-bottom: 70px;
`;

const StyledScreen = styled.div`
  padding: 1rem;
  overflow-y: auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ProgressContainer = styled.div`
  flex-grow: 1;
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
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
  align-items: center;

  .left-btn {
    display: flex;
    align-items: center;
  }
  button {
    border: none;
    margin-right: 0.25rem;
  }
`;

const StyledP = styled.p`
  margin: 3rem 0;
`;

const ListItem = styled.div`
  background-color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  height: auto;
  width: 100%;
  min-height: 4.5rem;
`;

const DirectoryPath = styled.div`
  font-weight: bold;
  text-decoration: underline;
  text-underline-offset: 0.2rem;
  margin-left: 0.5rem;
`;

const ListContentWrapper = styled.div`
  margin-left: 3%;
  width: 100%;
`;

const StyledH4 = styled.span`
  margin: 0;
  margin-top: 0.1rem;
  font-size: large;
  font-weight: bold;
  display: block;
`;

const NewFolderIcon = styled(FolderIcon)`
  color: #fbd61c;
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

const StyledButton = styled.button`
  background-color: #f8f8f8;
  border: none;
  margin-bottom: 5px;
`;
const ListWrapper = styled.div`
  padding: 0 0.5rem 0 0.5rem;
`;

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [contractList, setContractList] = useState<Contract[]>([]);
  const [directoryList, setDirectoryList] = useState<Directory[]>([]);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedContracts, setSelectedContracts] = useState<Contract[]>([]);
  const [selectedDirectories, setSelectedDirectories] = useState<Directory[]>(
    []
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [checkDialog, setCheckDialog] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { path, pathName } = useSelector((state: RootState) => state.account);
  const [currentLocation, setCurrentLocation] = useState<number>(
    path[path.length - 1]
  );
  const [moveBtnVisible, setMoveBtnVisible] = useState<boolean>(false);
  const addContract = () => {
    navigate("/camera", { state: { currentLocation } });
  };

  const goResult = async (contractId: number, name: string) => {
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
          name,
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
        .then((res) => {
          axios({
            method: "get",
            url: `${serverURL}/api/v1/directories/${currentLocation}/files`,
          }).then((res) => {
            setContractList(res.data.contracts);
            setDirectoryList(res.data.directories);
            setCheckDialog(false);
          });
        })
        .catch((err) => {
          console.log(err);
          navigate("/");
        });
    }
  }, [checkDialog]);

  // useEffect(() => {
  //   const timeout = setInterval(() => {
  //     console.log("load again");
  //     axios({
  //       method: "get",
  //       url: `${serverURL}/api/v1/directories/${currentLocation}/files`,
  //     })
  //       .then((res) => {
  //         setIsLoading(false);
  //         setContractList(res.data.contracts);
  //         setDirectoryList(res.data.directories);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }, 3000);

  //   return () => {
  //     clearInterval(timeout);
  //   };
  // }, []);

  useEffect(() => {
    axios({
      method: "get",
      url: `${serverURL}/api/v1/directories/${currentLocation}/files`,
    })
      .then((res) => {
        setIsLoading(false);
        setContractList(res.data.contracts);
        setDirectoryList(res.data.directories);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentLocation]);
  const getContract = () => {
    axios({
      method: "get",
      url: `${serverURL}/api/v1/directories/${currentLocation}/files`,
    })
      .then((res) => {
        setIsLoading(false);
        setContractList(res.data.contracts);
        setDirectoryList(res.data.directories);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // useEffect(() => {
  //   window.history.pushState(null, "", "");
  //   const preventBackBtn = (e: PopStateEvent) => {
  //     if (path.length > 1) {
  //       removePath(path.length - 2);
  //     } else {
  //       window.history.pushState(null, "", "");
  //     }
  //   };
  //   window.addEventListener("popstate", preventBackBtn);
  //   return () => {
  //     window.removeEventListener("popstate", preventBackBtn);
  //   };
  // }, [currentLocation, navigate]);

  const handleTouchContractStart = (contract: Contract) => {
    const id = setTimeout(() => {
      setSelectedContracts([contract]);
      setMoveBtnVisible(false);
      setDrawerOpen(true);
    }, 500);
    timeoutIdRef.current = id;
  };
  const handleTouchDirectoryStart = (directory: Directory) => {
    const id = setTimeout(() => {
      setSelectedDirectories([directory]);
      setMoveBtnVisible(false);
      setDrawerOpen(true);
    }, 500);
    timeoutIdRef.current = id;
  };

  const handleTouchEnd = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
  };

  const selectContract = (item: Contract | Directory) => {
    if ("status" in item) {
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

  const moveFiles = async () => {
    for (const e of selectedContracts) {
      await axios({
        method: "put",
        url: `${serverURL}/api/v1/contracts/${e.id}`,
        data: {
          parentId: currentLocation,
        },
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    }

    for (const e of selectedDirectories) {
      await axios({
        method: "put",
        url: `${serverURL}/api/v1/directories/${e.id}`,
        data: {
          parentId: currentLocation,
        },
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    }
  };

  const clickContract = (contract: Contract) => {
    if (drawerOpen === true) {
      selectContract(contract);
    } else if (contract.status === "DONE") {
      goResult(contract.id, contract.name);
    } else {
      alert("분석이 완료되지 않은 계약서입니다.");
    }
  };

  const contractStatus = (contract: Contract) => {
    if (contract.status === "FAIL") {
      return "분석에 실패하였습니다";
    }
    setTimeout(() => getContract(), 2000);
    // setCheckDialog(true);
    if (contract.status === "ANALYZE_INIT") {
      return "분석 시작";
    } else if (
      contract.status === "ANALYZE_CHECK_START" ||
      contract.status === "ANALYZE_CHECK_END" ||
      contract.status === "ANALYZE_CORRECTION_END" ||
      contract.status === "ANALYZE_CORRECTION_START"
    ) {
      return "계약서 분석 중";
    } else if (
      contract.status === "TAG_GEN_START" ||
      contract.status === "TAG_GEN_END"
    ) {
      return "태그 분류 중";
    } else {
      return "조항 인식 중";
    }
  };
  const addFolder = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <Container>
      <StyledScreen className="StyledScreen">
        {/* <HomeNavbar /> */}
        <br />
        {/* <h3>
          <img src={docu} alt="document" style={{ marginRight: "1vw" }} />
          계약서 목록
        </h3>
        <p>
          <span style={{ fontWeight: "bold" }}>{username}</span>님, 안녕하세요.
        </p> */}
        <MenuBar>
          <div style={{ display: "flex" }}>
            <StyledButton
              onClick={() =>
                path.length > 1 ? removePath(path.length - 2) : null
              }
            >
              <ArrowBackIcon />
            </StyledButton>
            <DirectoryPath>
              {path.map((e, idx) =>
                e === path[path.length - 1] ? (
                  <span key={idx} onClick={() => removePath(idx)}>
                    {pathName[idx]}
                  </span>
                ) : (
                  <span key={idx} onClick={() => removePath(idx)}>
                    {pathName[idx]} {" > "}
                  </span>
                )
              )}
            </DirectoryPath>
          </div>
          {/* <PlusBtn
            currentLocation={currentLocation}
            checkDialog={checkDialog}
            setCheckDialog={setCheckDialog}
          /> */}
          <div className="left-btn">
            <PlusBtn
              currentLocation={currentLocation}
              checkDialog={checkDialog}
              setCheckDialog={setCheckDialog}
            />
            <SearchIcon onClick={() => navigate("/search")} />
          </div>
        </MenuBar>
        {isLoading ? (
          <ProgressContainer>
            <CircularProgress size={"10rem"} />
          </ProgressContainer>
        ) : contractList.length > 0 || directoryList.length > 0 ? (
          <>
            <ListWrapper>
              <Stack
                spacing={1.5}
                sx={{ width: "100%" }}
                direction="column"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {directoryList.map((directory) => (
                  <Card
                    sx={{
                      padding: "10px",
                      margin: "0",
                      width: "100%",
                      borderRadius: "10px",
                    }}
                    key={directory.id}
                    style={{
                      backgroundColor: selectedDirectories.includes(directory)
                        ? "#CFCFCF"
                        : "white",
                    }}
                  >
                    <ListItem
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
                        <StyledH4>{directory.name}</StyledH4>
                      </ListContentWrapper>
                    </ListItem>
                  </Card>
                ))}

                {contractList.map((contract) => (
                  <ContractListItem
                    key={contract.id}
                    contract={contract}
                    selectedContracts={selectedContracts}
                    drawerOpen={drawerOpen}
                    clickContract={clickContract}
                    handleTouchContractStart={handleTouchContractStart}
                    handleTouchEnd={handleTouchEnd}
                    contractStatus={contractStatus}
                  />
                ))}
                {/* <Card
                  sx={{
                    padding: "10px",
                    margin: "0",
                    width: "100%",
                    borderRadius: "10px",
                    backgroundColor: "#D0D0D0",
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "larger",
                  }}
                  onClick={() => {
                    addFolder();
                  }}
                >
                  +
                </Card> */}
              </Stack>
            </ListWrapper>
          </>
        ) : (
          <BlankWrapper>
            <StyledP>계약서 목록이 비었어요.</StyledP>
            <img src={blankbox} alt="image1" />
            <StyledP>계약서 추가 후 분석 결과를 받아보세요.</StyledP>
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
        checkDialog={checkDialog}
        setCheckDialog={setCheckDialog}
      />
      <MoveBtnBar
        style={{
          visibility: moveBtnVisible ? "visible" : "hidden",
          zIndex: "1",
        }}
      >
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
      <AddDialog
        opendialog={openDialog}
        onClose={handleDialogClose}
        currentLocation={currentLocation}
        checkDialog={checkDialog}
        setCheckDialog={setCheckDialog}
      />
      <BottomNavigationBar />
    </Container>
  );
};

export default Home;
