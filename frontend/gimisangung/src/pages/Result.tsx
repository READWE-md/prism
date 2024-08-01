import React, { ChangeEvent, useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import Container from "@mui/material/Container";
import AccordionExpandIcon from "../components/Accordion";
import ToxicDetail from "../components/ToxicDetail";
import FilterListIcon from "@mui/icons-material/FilterList";
const CustomCheckboxContainer = styled.div`
  width: 333px;
  height: 40px;
  position: relative;
  overflow: hidden;
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  display: none;
`;

const Label = styled.label`
  height: 100%;
  width: 100%;
`;

interface StatusSwitchProps {
  checked: boolean;
}

const slideLeft = keyframes`
  from {
    left: 14px;
  }
  to {
    left: 50%;
  }
`;

const slideRight = keyframes`
  from {
    left: 50%;
  }
  to {
    left: 14px;
  }
`;

const StatusSwitch = styled.div<StatusSwitchProps>`
  cursor: pointer;
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #d9d9d9;
  transition: background-color 0.3s ease;
  border-radius: 9px;

  color: #757575;
  font-family: "Inter-Bold", Helvetica;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: normal;

  &:before,
  &:after {
    border-radius: 15px;
    height: 33px;
    width: 153px;
    position: absolute;
    justify-content: center;
    align-content: center;
    transition: all 0.3s ease;
    content: attr(data-unchecked);
    top: 3px;
  }

  &:before {
    background-color: white;
    color: #757575;
    left: 14px;
    z-index: 10;
    animation: ${(props) => (props.checked ? slideLeft : slideRight)} 0.3s ease;
  }

  &:after {
    right: 0;
    content: attr(data-checked);
  }

  ${HiddenCheckbox}:checked + ${Label} & {
    &:after {
      left: 0;
      content: attr(data-unchecked);
    }

    &:before {
      left: 50%;
      content: attr(data-checked);
    }
  }
`;

const StyledContainer = styled(Container)`
  height: auto;
  text-align: center;
  padding-bottom: 2rem;
  margin-top: 1rem;
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
    url: string;
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

const Result = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [filterOption, setFilterOption] = useState<null | string>(null);

  const contractDetail: ContractDetailType = state.data;

  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked((prev) => !prev);
  };

  const ToggleBar = useCallback(() => {
    return (
      <CustomCheckboxContainer>
        <HiddenCheckbox
          id="status"
          checked={checked}
          onChange={handleCheckboxChange}
        />
        <Label htmlFor="status">
          <StatusSwitch
            checked={checked}
            data-checked="원문에서 보기"
            data-unchecked="한 눈에 보기"
          />
        </Label>
      </CustomCheckboxContainer>
    );
  }, [checked]);

  const FilterOption = () => {
    const onFilterClick = (newValue: string) => {
      if (filterOption === newValue) {
        setFilterOption(null);
      } else {
        setFilterOption(newValue);
      }
    };
    return (
      <FilterContainer>
        <div>
          <FilterListIcon />
        </div>
        <FilterButton
          $clicked={filterOption === "safe" ? true : false}
          $danger="green"
          onClick={() => onFilterClick("safe")}
        >
          안전
        </FilterButton>
        <FilterButton
          $clicked={filterOption === "caution" ? true : false}
          $danger="orange"
          onClick={() => onFilterClick("caution")}
        >
          주의
        </FilterButton>
        <FilterButton
          $clicked={filterOption === "danger" ? true : false}
          $danger="red"
          onClick={() => onFilterClick("danger")}
        >
          위험
        </FilterButton>
      </FilterContainer>
    );
  };

  return (
    <StyledContainer>
      <ToggleBar />
      {checked ? (
        <>
          <ToxicDetail contractDetail={contractDetail} />
        </>
      ) : (
        <>
          <FilterOption />
          {contractDetail.clauses.map((e, idx) => {
            if (filterOption === null || e.type === filterOption) {
              return (
                <AccordionExpandIcon
                  title={e.content}
                  text={e.result}
                  type={e.type}
                  key={idx}
                />
              );
            } else {
              return null;
            }
          })}
          <ButtonContainer>
            <DoneBtn
              onClick={() => {
                navigate("/home");
              }}
            >
              다 확인 했어요
            </DoneBtn>
          </ButtonContainer>
        </>
      )}
    </StyledContainer>
  );
};

export default Result;
