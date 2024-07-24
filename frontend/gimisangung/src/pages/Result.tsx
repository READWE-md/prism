import React, { FC, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import ContractSummary from "../components/ContractSummary";
import DangerSummary from "../components/DangerSummary";
import DangerDetail from "../components/DangerDetail";
import ViewMethod from "../components/ViewMethod";
import ViewMethodTest from "../components/ViewMethodTest";
import AccordionExpandIcon from "../components/Accordion";

const StyledContainer = styled(Container)`
  height: auto;
  text-align: center;
  padding-bottom: 2rem;
`;

interface ContractDetailType {
  statusCode: number;
  id: number;
  summary: string;
  filepath: string;
  poisons: Array<{
    content: string;
    boxes: Array<{
      ltx: number;
      lty: number;
      rbx: number;
      rby: number;
    }>;
    result: string;
    confidence_score: number;
  }>;
}

const Result: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  // const [contractDetail, setContracTypetDetail] = useState<ContractDetailType>(
  //   state.data
  // );
  // const contractDetail: ContractDetailType = state.data;

  useEffect(() => {
    // axios.get("http://localhost:8000/api/v1/contracts/1").then((res) => {
    //   console.log("Contract Detail:", res.data);
    //   setContractDetail(res.data);
    // });
    // setContractDetail(state.data);
  }, []);

  // console.log("state:", state.data);

  return (
    <StyledContainer>
      <ViewMethod />
      <h3>총 5가지의 문제점이 발견되었어요</h3>
      <AccordionExpandIcon />
      <Button
        onClick={() => {
          navigate("/");
        }}
        variant="outlined"
      >
        저장하기
      </Button>
    </StyledContainer>
  );
};

export default Result;
