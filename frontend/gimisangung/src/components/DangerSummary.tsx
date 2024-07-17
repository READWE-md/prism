import styled from "styled-components";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import CircularProgress from "@mui/material/CircularProgress";

const GradeContainer = styled.div`
  /* display: flex; */
  border-bottom: 1px dotted black;
  padding: 10px;
  margin-bottom: 10px;
`;

interface DangerSummaryProps {
  data: string | undefined;
}

const DangerSummary = ({ data }: DangerSummaryProps) => {
  return (
    <GradeContainer>
      <h3>위험 요약</h3>
      {data ? (
        <>
          <ReportProblemRoundedIcon sx={{ color: "red", fontSize: 40 }} />
          <p>
            <strong>{data}</strong>
          </p>
        </>
      ) : (
        <CircularProgress />
      )}
    </GradeContainer>
  );
};

export default DangerSummary;
