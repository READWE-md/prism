import { Paper } from "@mui/material";
import styled from "styled-components";

interface ToxicDescriptionProps {
  danger: String;
  title: String;
  text: String;
}

const StyledPaper = styled(Paper)`
  width: 100%;
`;
const ToxicDescription = ({ danger, title, text }: ToxicDescriptionProps) => {
  return (
    <StyledPaper>
      <h5>{title}</h5>
      <p>{text}</p>
    </StyledPaper>
  );
};

export default ToxicDescription;
