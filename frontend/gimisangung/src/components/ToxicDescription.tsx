import { Paper } from "@mui/material";
import styled from "styled-components";

interface ToxicDescriptionProps {
  danger: String;
  title: String;
  text: String;
}

const StyledDiv = styled.div`
  /* background-color: red; */
  height: 150px;
  overflow-y: auto;
`;
const ToxicDescription = ({ danger, title, text }: ToxicDescriptionProps) => {
  return (
    <Paper>
      <StyledDiv>
        <h5>{title}</h5>
        <p>{text}</p>
      </StyledDiv>
    </Paper>
  );
};

export default ToxicDescription;
