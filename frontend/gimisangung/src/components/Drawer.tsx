import React, { useState } from "react";
import styled from "styled-components";

import DeleteDialog from "./DeleteDialog";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";

interface Contract {
  id: string;
  state: string;
  title: string;
  created_at: string;
  start_date: string;
  expire_date: string;
  tags: string[];
}

interface Directory {
  id: string;
  title: string;
  created_at: string;
}

interface DrawerProps {
  open: boolean;
  toggleDrawer: (open: boolean) => void;
  contracts: Contract[];
  directories: Directory[];
  lengthOfList: number;
}

const Wrapper = styled.div<{ open: boolean }>`
  position: fixed;
  bottom: 0;
  background-color: white;
  border-top: 1px solid #ddd;
  transform: translateY(${(props) => (props.open ? "0" : "100%")});
  transition: transform 0.3s ease-in-out;
  z-index: 1300;
  width: 100%;
`;
const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem 0 1rem;
`;
const StyledButton = styled.button`
  background: none;
  border: none;
`;

const Drawer = ({
  open,
  toggleDrawer,
  contracts,
  directories,
  lengthOfList,
}: DrawerProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const moveFile = () => console.log(contracts);
  const editFile = () => console.log(2);
  const deleteFile = () => {
    setOpenDialog(true);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <Wrapper open={open}>
      <TopBar>
        <span>{lengthOfList}개 선택됨</span>
        <StyledButton onClick={() => toggleDrawer(false)}>X</StyledButton>
      </TopBar>
      <List>
        <ListItem
          disablePadding
          onClick={() => {
            moveFile();
            toggleDrawer(false);
          }}
        >
          <ListItemButton>
            <ListItemIcon>
              <DriveFileMoveOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="이동하기" />
          </ListItemButton>
        </ListItem>
        {lengthOfList <= 1 ? (
          <ListItem
            disablePadding
            onClick={() => {
              editFile();
              toggleDrawer(false);
            }}
          >
            <ListItemButton>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary="수정하기" />
            </ListItemButton>
          </ListItem>
        ) : null}
        <ListItem
          disablePadding
          onClick={() => {
            deleteFile();
            toggleDrawer(false);
          }}
        >
          <ListItemButton>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary="삭제하기" />
          </ListItemButton>
        </ListItem>
        <DeleteDialog
          opendialog={openDialog}
          onClose={handleDialogClose}
          contracts={contracts}
        />
      </List>
    </Wrapper>
  );
};
export default Drawer;
