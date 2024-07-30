import React, { ChangeEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import AccordionExpandIcon from "../components/Accordion";
import ToxicDetail from "../components/ToxicDetail";

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

const StatusSwitch = styled.div<StatusSwitchProps>`
  cursor: pointer;
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #d9d9d9;
  transition: all 0.5s ease;
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
    left: 3px;
    z-index: 10;
    left: 14px;
    /* top: 6px; */
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

  const [checked, setChecked] = React.useState<boolean>(false);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const ToggleBar = () => {
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
  };

  const FilterOption = () => {
    return (
      <div>
        <Button onClick={() => setFilterOption(null)}>all</Button>
        <Button onClick={() => setFilterOption("safe")}>안전</Button>
        <Button onClick={() => setFilterOption("caution")}>주의</Button>
        <Button onClick={() => setFilterOption("danger")}>위험</Button>
      </div>
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
          <h3>
            총 {contractDetail.clauses.length}가지의 문제점이 발견되었어요
          </h3>
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
            }
            // return (
            //   <AccordionExpandIcon
            //     title={e.content}
            //     text={e.result}
            //     type={e.type}
            //     key={idx}
            //   />
            // );
          })}
          <Button
            onClick={() => {
              navigate("/");
            }}
            variant="outlined"
          >
            다 확인 했어요
          </Button>
        </>
      )}
    </StyledContainer>
  );
};

export default Result;
