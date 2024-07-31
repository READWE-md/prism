import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface Directory {
  id: string;
  title: string;
  created_at: string;
}

interface EditDialogProps {
  opendialog: boolean;
  onClose: () => void;
  directory: Directory;
}

const EditDialog = ({
  opendialog,
  onClose,
  currentLocation,
}: EditDialogProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(opendialog);
  const parentId = currentLocation;

  const editFolder = (folderName: string, parentId: number) => {
    axios({
      method: "post",
      url: "http://127.0.0.1:8080/api/v1/directories",
      params: {
        name: folderName,
        parentId,
      },
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setOpen(opendialog);
  }, [opendialog]);

  const handleClose = () => {
    setOpen(false);
    onClose(); // 부모 컴포넌트에게 닫기 동작을 알림
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
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const folderName = formJson.folderName;
            editFolder(folderName, parentId);
            handleClose();
          },
        }}
      >
        <DialogTitle>폴더 추가</DialogTitle>
        <DialogContent>
          <DialogContentText>폴더 이름</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="folderName"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button type="submit">추가</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default EditDialog;
