import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

const StyledContainer = styled(Container)`
  height: 100%;
  text-align: center;
`;

const data = {
  summary: { title: "blahbl", period: "blababla" },
  danger: { "1": "asdfasdfasdf", "2": "lklklklkl" },
  predict: { "1": "zxczvzxcv", "2": "rrqeqqq" },
};

const GradeContainer = styled.div`
  display: flex;
  border-bottom: 1px dotted black;
  padding: 10px;
  margin-bottom: 10px;
`;
const ContentContainer = styled.div`
  border-bottom: 1px dotted black;
  padding: 10px;
  margin-bottom: 10px;
`;

const DangerGrade: FC = () => {
  return (
    <GradeContainer>
      <div>
        <div>위험 등급</div>
        <div>데이터(위험)</div>
      </div>
      <img src="/" alt="img" />
    </GradeContainer>
  );
};

interface ResultContentProps {
  curr: Object;
}

const ResultContent: FC<ResultContentProps> = ({ curr }) => {
  return (
    <div>
      {Object.entries(curr).map(([key, value]) => (
        <p key={key}>
          {key}: {value.toString()}
        </p>
      ))}
    </div>
  );
};

const Result: FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({});
  const [danger, setDanger] = useState({});
  const [predict, setPredict] = useState({});

  useEffect(() => {
    setSummary(data.summary);
    setDanger(data.danger);
    setPredict(data.predict);
  }, []);

  return (
    <StyledContainer>
      <DangerGrade />
      <ContentContainer>
        <h3>계약서 요약</h3>
        <ResultContent curr={summary} />
      </ContentContainer>
      <h3>위험 조항</h3>
      <ResultContent curr={danger} />
      <h3>예상 결과</h3>
      <ResultContent curr={predict} />
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
