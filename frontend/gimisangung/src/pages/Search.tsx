import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { Card, Stack, Box, Typography } from "@mui/material";
import BottomNavigationBar from "../components/BottomNavigationBar";
import SearchDrawer from "../components/SearchDrawer";
import NavBar from "../components/NavBar";
import ContractListItem from "../components/ContractListItem";
import SearchIcon from "@mui/icons-material/Search";

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

const Container = styled.div`
  min-height: 100%;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
`;

const StyledScreen = styled.div`
  background-color: #f8f8f8;
  height: 100vh;
  padding: 1rem;
  overflow-y: auto;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 75%;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const StyledInput = styled.input`
  border: none;
  background-color: #f8f8f8;
  width: 80%;
  height: 2rem;
  padding: 0.3rem 0;
  &::placeholder {
    color: #ccc;
  }
  &:focus {
    outline: none;
  }
`;

const StyledForm = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  border: 1px solid lightgray;
  border-radius: 10px;
`;

const SearchResult = styled.div`
  margin-top: 2rem;
  width: 100%;
`;

const TagWrapper = styled.div`
  margin: 0.3rem 0.1rem;
  display: flex;
  flex-wrap: wrap;
`;

const Tag = styled.div`
  font-size: 12px;
  margin-left: 0.4rem;
  color: white;
  border-radius: 15px;
  padding: 0.2rem 0.5rem;
  margin-top: 0.3rem;
`;

const FastSearch = styled.div`
  display: flex;
  flex-direction: column;
  align-self: start;
  width: 100%;
`;

const StyledP = styled.p`
  margin: 0;
  font-size: #606060;
  border-bottom: 1px solid #e0e0e0;
  padding-top: 1rem;
  padding-bottom: 0.2rem;
  padding-left: 0.5rem;
`;

const FastTagWrapper = styled(TagWrapper)`
  padding-left: 1rem;
  padding-right: 1rem;
`;

const FastTag = styled(Tag)`
  font-size: 14px;
  padding: 0.3rem 0.5rem;
  display: flex;
  align-self: center;
`;

const ResultWrapper = styled.div`
  margin-top: 0.5rem;
  padding: 0 0.5rem 0 0.5rem;
`;

const SearchButton = styled.button`
  border: none;
  background-color: #f8f8f8;
  margin-right: 0.2rem;
  height: 2rem;
  border-radius: 10px;
  padding: 0.3rem;
`;

const Search = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<Contract[] | null>(null);

  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedContracts, setSelectedContracts] = useState<Contract[]>([]);
  const colors = ["#1769AA", "#A31545", "#B2A429", "#008a05", "#34008e"];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [keyword, setKeyword] = useState<string>("");
  const [fastTags, setFastTags] = useState<string[]>([]);
  const [recentContracts, setRecentContracts] = useState<Contract[]>([]);

  useEffect(() => {
    axios({
      method: "get",
      url: `${serverURL}/api/v1/tags`,
    })
      .then((res) => {
        setFastTags(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios({
      method: "get",
      url: `${serverURL}/api/v1/contracts`,
    })
      .then((res) => {
        setRecentContracts(res.data.contracts.slice(0, 3));
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!drawerOpen) {
      setSelectedContracts([]);
    }
  }, [drawerOpen]);

  const handleTouchContractStart = (contract: Contract) => {
    const id = setTimeout(() => {
      setSelectedContracts((prevContracts) => [...prevContracts, contract]);

      setDrawerOpen(true);
    }, 500);
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
  const clickContract = (contract: Contract) => {
    if (drawerOpen === true) {
      selectContract(contract);
    } else if (contract.status === "DONE") {
      goResult(contract.id, contract.name);
    } else {
      alert("분석이 완료되지 않은 계약서입니다.");
    }
  };

  const searchContracts = () => {
    axios({
      method: "get",
      url: `${serverURL}/api/v1/contracts`,
      params: {
        keyword,
      },
    })
      .then((res) => {
        setResult(res.data.contracts);
      })
      .catch((err) => console.log(err));
  };
  const searchByTag = (tag: string) => {
    axios({
      method: "get",
      url: `${serverURL}/api/v1/contracts`,
      params: {
        keyword: tag,
      },
    })
      .then((res) => {
        setResult(res.data.contracts);
      })
      .catch((err) => console.log(err));
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

  const contractStatus = (contract: Contract) => {
    if (contract.status === "FAIL") {
      return "분석에 실패하였습니다";
    }
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

  return (
    <Container>
      <StyledScreen>
        <NavBar />
        <Wrapper>
          <StyledForm
            onSubmit={(e) => {
              e.preventDefault();
              searchContracts();
            }}
          >
            <StyledInput
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="계약서명 또는 태그"
            ></StyledInput>
            <SearchButton>
              <SearchIcon />
            </SearchButton>
          </StyledForm>
          <FastSearch>
            <StyledP>빠르게 찾기</StyledP>
            <FastTagWrapper>
              {fastTags ? (
                fastTags.map((tag: string, idx) => (
                  <FastTag
                    key={tag}
                    style={{
                      backgroundColor: colors[idx % colors.length],
                      display: tag === "." ? "none" : "block",
                    }}
                    onClick={() => searchByTag(tag)}
                  >
                    {tag}
                  </FastTag>
                ))
              ) : (
                <p>현재 갖고 계신 계약서가 없습니다.</p>
              )}
            </FastTagWrapper>
          </FastSearch>
          <SearchResult>
            {result === null ? (
              recentContracts ? (
                <div>
                  <StyledP>최근 계약서</StyledP>

                  <ResultWrapper>
                    <Stack
                      spacing={1.5}
                      direction="column"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ width: "100%" }}
                    >
                      {recentContracts.map((contract: Contract) => (
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
                    </Stack>
                  </ResultWrapper>
                </div>
              ) : null
            ) : (
              <>
                {result && (
                  <>
                    <StyledP>검색 결과</StyledP>
                    <ResultWrapper>
                      <Stack
                        spacing={1.5}
                        direction="column"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{ width: "100%" }}
                      >
                        {result.map((contract: Contract) => (
                          <ContractListItem
                            key={contract.id}
                            contract={contract}
                          />
                        ))}
                      </Stack>
                    </ResultWrapper>
                  </>
                )}
              </>
            )}
          </SearchResult>
        </Wrapper>
      </StyledScreen>
      <SearchDrawer
        open={drawerOpen}
        toggleDrawer={setDrawerOpen}
        contracts={selectedContracts}
        lengthOfList={selectedContracts.length}
      />
      <BottomNavigationBar></BottomNavigationBar>
    </Container>
  );
};

export default Search;
