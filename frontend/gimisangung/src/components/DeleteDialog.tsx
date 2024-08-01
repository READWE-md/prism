import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

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

interface DeleteDialogProps {
  opendialog: boolean;
  onClose: () => void;
  contracts: Contract[];
  directories: Directory[];
}

const DeleteDialog = ({
  opendialog,
  onClose,
  contracts,
  directories,
}: DeleteDialogProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(opendialog);

  const deleteDirectory = (id: string) => {
    axios({
      method: "delete",
      url: `http://127.0.0.1:8080/api/v1/directories/${id}`,
    })
      .then((res) => console.log(res))
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteContract = (id: string) => {
    axios({
      method: "delete",
      url: `http://127.0.0.1:8080/api/v1/contracts/${id}`,
    })
      .then((res) => console.log(res))
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    setOpen(opendialog);
  }, [opendialog]);

  const handleClose = () => {
    setOpen(false);
    onClose();
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
            contracts.forEach((e) => {
              deleteContract(e.id);
            });
            directories.forEach((e) => {
              deleteDirectory(e.id);
            });

            handleClose();
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
