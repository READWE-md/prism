import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import styled from "styled-components";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
interface AccordionProps {
  title: string;
  text: string;
  type: string;
  idx: number;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  selectedToxic: number | null;
  setSelectedToxic: React.Dispatch<React.SetStateAction<number | null>>;
  showCarousel: string;
  setShowCarousel: React.Dispatch<React.SetStateAction<string>>;
}

const AccordionContainer = styled.div`
  width: 100%;
  margin: 0.5rem 0;
`;

const TitleContainer = styled.div`
  text-justify: center;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
const Title = styled.div`
  height: 1.5rem;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: start;
  display: inline-block;
  font-weight: bold;
`;

const CautionIcon = styled(WarningIcon)`
  color: orange !important;
`;
const WarnIcon = styled(CancelIcon)`
  color: red !important;
`;
const SafeIcon = styled(CheckCircleIcon)`
  color: green !important;
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  text-align: start;
`;

const SwitchBtnContainer = styled.div`
  display: flex;
  justify-content: end;
`;

const StyledBtn = styled.button`
  border: none;
  background-color: white;
`;

export default function AccordionIcon({
  title,
  text,
  type,
  idx,
  setChecked,
  setSelectedToxic,
  setShowCarousel,
  selectedToxic,
}: AccordionProps) {
  return (
    <AccordionContainer id={idx.toString()}>
      <Accordion defaultExpanded={selectedToxic === idx ? true : false}>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <TitleContainer>
            <Title>{title}</Title>
            <span>
              {type === "danger" ? (
                <WarnIcon />
              ) : type === "caution" ? (
                <CautionIcon />
              ) : (
                <SafeIcon />
              )}
            </span>
          </TitleContainer>
        </AccordionSummary>
        <StyledAccordionDetails>
          <div style={{ fontWeight: "bold", marginBottom: "1rem" }}>
            {title}
          </div>
          <div>{text}</div>
          <SwitchBtnContainer>
            <StyledBtn
              onClick={() => {
                if (setChecked) {
                  setChecked(false);
                  setSelectedToxic(idx);
                  setShowCarousel("block");
                }
              }}
            >
              원문에서 보기
            </StyledBtn>
          </SwitchBtnContainer>
        </StyledAccordionDetails>
      </Accordion>
    </AccordionContainer>
  );
}
