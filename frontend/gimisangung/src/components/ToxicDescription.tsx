import { Paper } from "@mui/material";
import styled from "styled-components";
import { Warning, Cancel, CheckCircle } from "@mui/icons-material";
interface ToxicDescriptionProps {
  danger: String;
  title: String;
  text: String;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 1.5rem;
  width: 100%;
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

const ToxicDescription = ({
  danger,
  title,
  text,
  setChecked,
}: ToxicDescriptionProps) => {
  const handleClick = () => {
    setChecked(true);
  };
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
        <div>
          <button
            onClick={() => {
              handleClick();
            }}
          >
            자세히 보기
          </button>
        </div>
      </StyledDiv>
    </Paper>
  );
};

export default ToxicDescription;
