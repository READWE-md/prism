import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import Container from "@mui/material/Container";
import AccordionExpandIcon from "../components/Accordion";
import ToxicDetail from "../components/ToxicDetail";
import FilterListIcon from "@mui/icons-material/FilterList";

import { ArrowBack, ScreenShare } from "@mui/icons-material/";
import { useSelector } from "react-redux";
import { RootState } from "../reducer";
import TrafficLight from "../components/TrafficLight";
import { Element, animateScroll, scroller } from "react-scroll";

interface StatusSwitchProps {
  checked: boolean;
}

const slideLeft = keyframes`
  from {
    left: 5%;
  }
  to {
    left: 54.5%;
  }
`;

const slideRight = keyframes`
  from {
    left: 54.5%;
  }
  to {
    left: 5%;
  }
`;

const ToggleContainer = styled.div`
  width: 100%;
  height: 2.5rem;
  background-color: #d9d9d9;
  display: flex;
  position: relative;
  justify-content: space-around;
  align-items: center;
  border-radius: 5px;
`;

const BasicView = styled.div`
  width: 45%;
  height: auto;
  color: #757575;
  font-weight: bold;
  z-index: 10;
`;

const MovingToggle = styled.div<StatusSwitchProps>`
  position: absolute;
  top: 10%;
  left: ${(props) => (props.checked ? "54.5%" : "5%")};
  animation: ${(props) => (props.checked ? slideLeft : slideRight)} 0.3s ease;
  border-radius: 5px;
  background-color: white;
  width: 40%;
  height: 80%;
`;

const StyledContainer = styled(Container)`
  min-height: 100%;
  text-align: center;
  padding-bottom: 2rem;
  padding-top: 1rem;
  background-color: #f8f8f8;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 0.75rem 0;
  padding: 0 1rem;
  align-items: center;
  width: 100%;
`;

interface FilterButtonProps {
  $danger: string;
  $clicked: boolean;
}

const FilterButton = styled.button<FilterButtonProps>`
  color: white;
  background-color: ${(props) => props.$danger};
  padding: 0.5rem 1.5rem;
  border-radius: 7%;
  border: 0px;
  opacity: ${(props) => (props.$clicked ? 0.5 : 1)};
`;

const ButtonContainer = styled.div`
  width: 100%;
  margin-top: 1rem;
  display: flex;
  justify-content: center;
`;

const DoneBtn = styled.button`
  background-color: #0064ff;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;
  width: 95%;
`;

export interface ContractDetailType {
  contractId: number;
  images: Array<{
    page: number;
    base64: string;
  }>;
  clauses: Array<{
    type: string;
    content: string;
    result: string;
    boxes: Array<{
      ltx: number;
      lty: number;
      rbx: number;
      rby: number;
      page: number;
    }>;
    confidence_score: number;
  }>;
}

const ResultNav = styled.div`
  width: 100%;
  height: 3rem;
  /* background-color: blue; */
  display: flex;
  margin-bottom: 0.5rem;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.div`
  font-size: 1.25rem;
  font-weight: 500;
`;

const BackBtn = styled.button`
  height: 50%;
  color: black;
  border: none;
  background-color: #f8f8f8;
`;

const TrafficContainer = styled.div`
  width: 100%;
  height: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
`;

const Light = styled.div<FilterButtonProps>`
  position: relative;
  background-color: gray;
  height: 6rem;
  width: 6rem;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  background-color: ${({ $danger }) =>
    $danger === "danger" ? "red" : $danger === "caution" ? "orange" : "green"};
  opacity: ${({ $clicked }) => ($clicked ? 0.5 : 1)};
`;

const ShareBtn = styled.button`
  border: none;
  background-color: #f8f8f8;
`;

const SummaryConatiner = styled.div`
  width: 100%;
  margin-top: 1rem;
`;

const serverUrl = process.env.REACT_APP_SERVER_URL;

const Result = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [filterOption, setFilterOption] = useState<null | string>(null);

  const contractDetail: ContractDetailType = state.data;

  const [checked, setChecked] = useState(false);
  const { userId } = useSelector((state: RootState) => state.account);
  // carousel control
  const [selectedToxic, setSelectedToxic] = useState<number | null>(null);
  const [showCarousel, setShowCarousel] = useState("none");

  const handleCheckboxChange = () => {
    setChecked((prev) => !prev);
  };

  const MyToggle = useCallback(
    ({ onClick }: { onClick: () => void }) => {
      return (
        <ToggleContainer onClick={onClick}>
          <MovingToggle checked={checked} />
          <BasicView>원문에서 보기</BasicView>
          <BasicView>한 눈에 보기</BasicView>
        </ToggleContainer>
      );
    },
    [checked]
  );
  const onFilterClick = (newValue: string) => {
    if (filterOption === newValue) {
      setFilterOption(null);
    } else {
      setFilterOption(newValue);
    }
  };

  const FilterOption = () => {
    return (
      <FilterContainer>
        <div>
          <FilterListIcon />
        </div>
        <FilterButton
          $clicked={filterOption === "danger" ? true : false}
          $danger="red"
          onClick={() => onFilterClick("danger")}
        >
          위험
        </FilterButton>
        <FilterButton
          $clicked={filterOption === "caution" ? true : false}
          $danger="orange"
          onClick={() => onFilterClick("caution")}
        >
          주의
        </FilterButton>
        <FilterButton
          $clicked={filterOption === "safe" ? true : false}
          $danger="green"
          onClick={() => onFilterClick("safe")}
        >
          안전
        </FilterButton>
      </FilterContainer>
    );
  };

  const shareBtnClicked = () => {
    console.log("shareBtnClicked", `${serverUrl}/share/${userId}`);
    const shareData = {
      title: "testTitle",
      text: "this is test text",
      url: `${serverUrl}/share/${userId}`,
    };
    navigator.share(shareData);
  };

  useEffect(() => {
    const SubContainer = document.getElementById("SubContainer");
    if (selectedToxic && SubContainer) {
      const selectedAccordion = document.getElementById(
        selectedToxic.toString()
      );
      const scrollNum = selectedAccordion?.getBoundingClientRect().top;
      console.log("scrollNum", scrollNum);
      if (scrollNum) {
        SubContainer.scroll({
          top: scrollNum + selectedAccordion.offsetHeight + 200,
          behavior: "smooth",
        });
      }
    }
  }, [checked]);

  return (
    <StyledContainer>
      <ResultNav>
        <BackBtn
          onClick={() => {
            navigate("/home");
          }}
        >
          <ArrowBack />
        </BackBtn>
        <Title>{state.name}</Title>
        <ShareBtn onClick={shareBtnClicked}>
          <ScreenShare />
        </ShareBtn>
      </ResultNav>
      <MyToggle onClick={handleCheckboxChange} />
      {checked ? (
        <SummaryConatiner className="SummaryContainer" id="SumamryContainer">
          <TrafficLight contractDetail={contractDetail} />

          <FilterOption />
          {contractDetail.clauses.map((e, idx) => {
            if (filterOption === null || e.type === filterOption) {
              return (
                <AccordionExpandIcon
                  title={e.content}
                  text={e.result}
                  type={e.type}
                  key={idx}
                  setChecked={setChecked}
                  selectedToxic={selectedToxic}
                  setSelectedToxic={setSelectedToxic}
                  setShowCarousel={setShowCarousel}
                  showCarousel={showCarousel}
                  idx={idx}
                />
              );
            } else {
              return null;
            }
          })}
        </SummaryConatiner>
      ) : (
        <ToxicDetail
          contractDetail={contractDetail}
          selectedToxic={selectedToxic}
          setSelectedToxic={setSelectedToxic}
          setShowCarousel={setShowCarousel}
          showCarousel={showCarousel}
          setChecked={setChecked}
        />
      )}
    </StyledContainer>
  );
};

export default Result;
