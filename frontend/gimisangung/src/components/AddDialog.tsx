import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface AddDialogProps {
  opendialog: boolean;
  onClose: () => void;
}

const AddDialog: React.FC<AddDialogProps> = ({ opendialog, onClose }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(opendialog);

  const addFolder = async () => {
    // try {
    //   const response = axios.post("/api/v1/directories"),
    //     {
    //       name,
    //       parentId,
    //     };
    //   navigate("/home");
    // } catch (error) {
    //   console.log(error);
    // }
  };

  React.useEffect(() => {
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
            const email = formJson.email;
            console.log(email);
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
            name="email"
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

export default AddDialog;
