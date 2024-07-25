import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface AccordionProps {
  title: string;
  text: string;
}

export default function AccordionIcon({ title, text }: AccordionProps) {
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <h4>{title}</h4>
        </AccordionSummary>
        <AccordionDetails>
          <p>{text}</p>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
