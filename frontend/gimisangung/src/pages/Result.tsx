import React, { ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import AccordionExpandIcon from "../components/Accordion";
import tempImg from "../assets/tempImg";
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

const Result: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const contractDetail: ContractDetailType = state.data;
  // console.log(contractDetail);

  const [checked, setChecked] = React.useState<boolean>(false);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <StyledContainer>
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
      {checked ? (
        <>
          <ToxicDetail contractDetail={contractDetail} imgUrl={tempImg} />
        </>
      ) : (
        <>
          <h3>
            총 {contractDetail.clauses.length}가지의 문제점이 발견되었어요
          </h3>
          {contractDetail.clauses.map((e, idx) => {
            return (
              <AccordionExpandIcon
                title={e.content}
                text={e.result}
                key={idx}
              />
            );
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
