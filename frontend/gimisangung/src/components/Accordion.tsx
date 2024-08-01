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
}

const TitleContainer = styled.div`
  text-justify: center;
  width: 100%;
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

export default function AccordionIcon({ title, text, type }: AccordionProps) {
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <TitleContainer>
            <span>{title}</span>
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
        <AccordionDetails>
          <p>{text}</p>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
