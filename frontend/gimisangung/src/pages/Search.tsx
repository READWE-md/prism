import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import BottomNavigationBar from "../components/BottomNavigationBar";
import DescriptionSharpIcon from "@mui/icons-material/DescriptionSharp";
import SearchDrawer from "../components/SearchDrawer";
import Checkbox from "@mui/material/Checkbox";
import NavBar from "../components/NavBar";
import ContractListItem from "../components/ContractListItem";

const serverURL = process.env.REACT_APP_SERVER_URL;

interface Contract {
  id: number;
  status: string;
  name: string;
  created_at: string;
  tags: string[];
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
  margin-top: 2rem;
  width: 100%;
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
  margin: 0.3rem 0.1rem;
  display: flex;
  flex-wrap: wrap;
`;

const Tag = styled.div`
  font-size: 12px;
  margin-left: 0.4rem;
  color: white;
  border-radius: 15px;
  padding: 0.2rem 0.4rem;
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
  padding: 0.4rem;
`;

const ResultWrapper = styled.div`
  margin-top: 0.5rem;
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
        setFastTags(res.data.tags);
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
            <StyledBtn>검색</StyledBtn>
          </StyledForm>
          <FastSearch>
            <StyledP>빠르게 찾기</StyledP>
            <FastTagWrapper>
              {fastTags.map((tag: string, idx) => (
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
              ))}
            </FastTagWrapper>
          </FastSearch>
          <SearchResult>
            {result === null ? (
              <div>
                <StyledP>최근 계약서</StyledP>
                <ResultWrapper>
                  {recentContracts.map((contract: Contract) => (
                    <ContractListItem key={contract.id} contract={contract} />
                  ))}
                </ResultWrapper>
              </div>
            ) : (
              <>
                {result && (
                  <>
                    <StyledP>검색 결과</StyledP>
                    <ResultWrapper>
                      {result.map((contract: Contract) => (
                        <ContractListItem
                          key={contract.id}
                          contract={contract}
                        />
                      ))}
                    </ResultWrapper>
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
      <BottomNavigationBar></BottomNavigationBar>
    </Container>
  );
};

export default Search;
