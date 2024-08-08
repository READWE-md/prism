import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AddDialog from "./AddDialog";

interface PlustbtnProps {
  currentLocation: number;
  checkDialog: boolean;
  setCheckDialog: React.Dispatch<React.SetStateAction<boolean>>;
}
const PlusButton = styled.button`
  border: none;
  background-color: #f8f8f8;
  font-size: x-large;
`;

const PlusBtn = ({
  currentLocation,
  checkDialog,
  setCheckDialog,
}: PlustbtnProps) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const addContract = () => {
    navigate("/camera", {
      state: {
        currentLocation,
      },
    });
  };

  const addFolder = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
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
        <MenuItem
          onClick={() => {
            addFolder();
            handleClose();
          }}
        >
          새 폴더
        </MenuItem>
        <MenuItem onClick={addContract}>새 계약서</MenuItem>
      </Menu>
      <AddDialog
        opendialog={openDialog}
        onClose={handleDialogClose}
        currentLocation={currentLocation}
        checkDialog={checkDialog}
        setCheckDialog={setCheckDialog}
      />
    </div>
  );
};

export default PlusBtn;
