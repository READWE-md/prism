import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const PlusButton = styled.button`
  border: none;
  background-color: #f8f8f8;
  font-size: x-large;
`;

const PlusBtn: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const addContract = () => {
    navigate("/camera");
  };

  return (
    <div>
      <PlusButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        +
      </PlusButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        elevation={2}
      >
        <MenuItem onClick={handleClose}>새 폴더</MenuItem>
        <MenuItem onClick={addContract}>새 계약서</MenuItem>
      </Menu>
    </div>
  );
};
export default PlusBtn;
