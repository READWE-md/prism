import { Paper } from "@mui/material";
import styled from "styled-components";
import { Warning, Cancel, CheckCircle } from "@mui/icons-material";
interface ToxicDescriptionProps {
  danger: String;
  title: String;
  text: String;
}

const StyledDiv = styled.div`
  height: 150px;
  /* overflow-y: auto; */
  padding: 0.5rem 1rem 1rem 1rem;
  text-align: start;
`;

const TitleContainer = styled.div`
  display: flex;
`;

const Title = styled.div`
  font-weight: bold;
  margin-bottom: 1rem;
`;

const CautionIcon = styled(Warning)`
  color: orange !important;
  margin-right: 0.5rem;
`;
const WarnIcon = styled(Cancel)`
  color: red !important;
  margin-right: 0.5rem;
`;
const SafeIcon = styled(CheckCircle)`
  color: green !important;
  margin-right: 0.5rem;
`;

const ToxicDescription = ({ danger, title, text }: ToxicDescriptionProps) => {
  return (
    <Paper>
      <StyledDiv>
        <TitleContainer>
          {danger === "danger" ? (
            <WarnIcon />
          ) : danger === "caution" ? (
            <CautionIcon />
          ) : (
            <SafeIcon />
          )}
          <Title>{title}</Title>
        </TitleContainer>
        <div>{text}</div>
      </StyledDiv>
    </Paper>
  );
};

export default ToxicDescription;
