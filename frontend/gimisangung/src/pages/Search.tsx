import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import DescriptionSharpIcon from "@mui/icons-material/DescriptionSharp";
import SearchDrawer from "../components/SearchDrawer";
import Checkbox from "@mui/material/Checkbox";
import NavBar from "../components/NavBar";

const serverURL = process.env.REACT_APP_SERVER_URL;

interface Contract {
  id: number;
  status: string;
  name: string;
  created_at: string;
  tags: string[];
}

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
  justify-content: center;
`;

const StyledInput = styled.input`
  border: none;
  background-color: #f8f8f8;
  border: 1px solid lightgray;
  margin-right: 1rem;
  width: 60%;
  height: 2rem;
  border-radius: 10px;
  padding: 0.3rem;
  &::placeholder {
    color: #ccc;
  }
  &:focus {
    outline: none;
    border-bottom: 1px solid #3fa2f6;
  }
`;

const StyledForm = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const StyledBtn = styled.button`
  border: none;
  background-color: #0064ff;
  padding: 0.6rem;
  border-radius: 10px;
  color: white;
`;

const SearchResult = styled.div`
  height: 60%;
  margin-top: 3rem;
  width: 80%;
`;

const ListItem = styled.div`
  background-color: white;
  padding: 0.2rem 0.5rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  height: auto;
  min-height: 4.5rem;
`;

const TagWrapper = styled.div`
  margin: 0.2rem 0;
  display: flex;
  flex-wrap: wrap;
`;

const Tag = styled.div`
  font-size: 12px;
  margin-left: 0.4rem;
  color: white;
  border-radius: 15px;
  padding: 0.1rem 0.3rem;
  margin-top: 0.3rem;
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

const Search = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<Contract[] | null>(null);

  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedContracts, setSelectedContracts] = useState<Contract[]>([]);
  const colors = ["#1769AA", "#A31545", "#B2A429", "#008a05", "#34008e"];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [keyword, setKeyword] = useState<string>("");

  const handleTouchContractStart = (contract: Contract) => {
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

  const searchContracts = () => {
    axios({
      method: "get",
      url: `${serverURL}/api/v1/contracts`,
      params: {
        keyword,
      },
    })
      .then((res) => {
        setResult(res.data.searchResult);
      })
      .catch((err) => console.log(err));
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

  return (
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
          <StyledBtn>검색</StyledBtn>
        </StyledForm>
        <SearchResult>
          {result === null ? (
            <p>검색어를 입력해주세요</p>
          ) : (
            <>
              {result && (
                <>
                  <p>검색 결과입니다</p>
                  {result.map((contract: Contract) => (
                    <ListItem
                      key={contract.id + "name"}
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
                          contract.status === "ANALYZE" ||
                          contract.status === "UPLOAD"
                            ? "50%"
                            : "100%",
                        border:
                          contract.status === "FAIL" ? "1px solid red" : "none",
                      }}
                    >
                      <Checkbox
                        checked={selectedContracts.includes(contract)}
                        style={{ display: drawerOpen ? "block" : "none" }}
                      />
                      <DescriptionSharpIcon color="primary" />
                      <ListContentWrapper>
                        <StyledH4>{contract.name}</StyledH4>
                        {contract.status === "DONE" ? (
                          <div>
                            <StyledCreatedAt>
                              {contract.created_at}
                            </StyledCreatedAt>
                            <TagWrapper>
                              {contract.tags.map((tag, idx) => (
                                <Tag
                                  key={tag}
                                  style={{
                                    backgroundColor:
                                      colors[idx % colors.length],
                                  }}
                                >
                                  #{tag}
                                </Tag>
                              ))}
                            </TagWrapper>
                          </div>
                        ) : contract.status === "ANALYZE" ? (
                          <StyledSpan>분석중</StyledSpan>
                        ) : contract.status === "UPLOAD" ? (
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
              )}
            </>
          )}
        </SearchResult>
      </Wrapper>
      <SearchDrawer
        open={drawerOpen}
        toggleDrawer={setDrawerOpen}
        contracts={selectedContracts}
        lengthOfList={selectedContracts.length}
      />
    </StyledScreen>
  );
};

export default Search;
