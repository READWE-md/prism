import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const serverURL = process.env.REACT_APP_SERVER_URL;

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

interface DeleteDialogProps {
  opendialog: boolean;
  onClose: () => void;
  contracts: Contract[];
  directories: Directory[];
  checkDialog?: boolean;
  setCheckDialog?: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteDialog = ({
  opendialog,
  onClose,
  contracts,
  directories,
  checkDialog,
  setCheckDialog,
}: DeleteDialogProps) => {
  const [open, setOpen] = useState<boolean>(opendialog);
  const [contractList, setContractList] = useState<Contract[]>([]);
  const [directoryList, setDirectoryList] = useState<Directory[]>([]);

  const deleteDirectory = async (id: number) => {
    await axios({
      method: "delete",
      url: `${serverURL}/api/v1/directories/${id}`,
    })
      .then((res) => console.log(res))
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteContract = async (id: number) => {
    await axios({
      method: "delete",
      url: `${serverURL}/api/v1/contracts/${id}`,
    })
      .then((res) => console.log(res))
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setOpen(opendialog);
    setContractList(contracts);
    setDirectoryList(directories);
  }, [opendialog]);

  const handleClose = () => {
    setOpen(false);
    setContractList([]);
    setDirectoryList([]);
    onClose();
  };

  const deleteFunction = async () => {
    for (const e of contractList) {
      await deleteContract(e.id);
    }

    for (const e of directoryList) {
      await deleteDirectory(e.id);
    }

    if (setCheckDialog) {
      await setCheckDialog(true);
    }
    handleClose();
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            deleteFunction();
          },
        }}
      >
        <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            "삭제" 버튼을 누를 시 선택한 계약서들이 영구적으로 삭제됩니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button type="submit" color="error">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default DeleteDialog;
