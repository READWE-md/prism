import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import DeleteDialog from "./DeleteDialog";
import EditDialog from "./EditDialog";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";

interface Contract {
  id: number;
  status: string;
  name: string;
  viewedAt: string;
  startDate: string | null;
  expireDate: string | null;
  tags: string[];
  parentId: number;
}

interface Directory {
  id: number;
  name: string;
  created_at: string;
}

interface DrawerProps {
  open: boolean;
  toggleDrawer: (open: boolean) => void;
  contracts: Contract[];
  directories: Directory[];
  lengthOfList: number;
  moveBtnVisible: boolean;
  setMoveBtnVisible: React.Dispatch<React.SetStateAction<boolean>>;
  checkDialog: boolean;
  setCheckDialog: React.Dispatch<React.SetStateAction<boolean>>;
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
  moveBtnVisible,
  setMoveBtnVisible,
  checkDialog,
  setCheckDialog,
}: DrawerProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const directory = useRef<Directory | null>(null);
  const navigate = useNavigate();

  const moveFile = () => {
    setMoveBtnVisible(true);
  };

  const editFile = () => {
    if (directories.length === 1) {
      directory.current = directories[0];
      setOpenEditDialog(true);
    } else if (contracts.length === 1) {
      const contract = contracts[0];
      navigate("/edit", { state: { data: contract } });
    }
  };
  const deleteFile = async () => {
    await setOpenDeleteDialog(true);
    toggleDrawer(false);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
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
          opendialog={openDeleteDialog}
          onClose={handleDeleteDialogClose}
          contracts={contracts}
          directories={directories}
          checkDialog={checkDialog}
          setCheckDialog={setCheckDialog}
        />
        <EditDialog
          opendialog={openEditDialog}
          onClose={handleEditDialogClose}
          directory={directory.current}
          checkDialog={checkDialog}
          setCheckDialog={setCheckDialog}
        />
      </List>
    </Wrapper>
  );
};
export default Drawer;
