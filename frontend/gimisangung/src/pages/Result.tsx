import React, { FC, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import ContractSummary from "../components/ContractSummary";
import DangerSummary from "../components/DangerSummary";
import DangerDetail from "../components/DangerDetail";

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
      {/* <DangerSummary data={contractDetail?.poisons[0].result} />
      <ContractSummary curr={contractDetail?.summary} /> */}
      <h3>위험 조항</h3>
      {/* { {contractDetail
        ? contractDetail.poisons.map((e, i) => {
            return <DangerDetail data={e} key={i} />;
          })
        : null} } */}
      <h3>예상 결과</h3>
      <p>hi</p>

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
