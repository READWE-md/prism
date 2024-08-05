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
import { useSelector } from "react-redux";
import { RootState } from "../reducer";

const serverURL = process.env.REACT_APP_SERVER_URL;

interface Directory {
  id: number;
  name: string;
  created_at: string;
}

interface EditDialogProps {
  opendialog: boolean;
  onClose: () => void;
  directory: Directory | null;
}

const EditDialog = ({ opendialog, onClose, directory }: EditDialogProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(opendialog);
  const { path } = useSelector((state: RootState) => state.account);
  const currentLocation: number = path[path.length - 1];
  const parentId = currentLocation;

  const editFolder = (folderName: string, parentId: number) => {
    if (directory) {
      axios({
        method: "put",
        url: `${serverURL}/api/v1/directories/${directory.id}`,
        params: {
          name: folderName,
          parentId,
        },
      })
        .then((res) => navigate("/home"))
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
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
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const folderName = formJson.folderName as string;
            editFolder(folderName, parentId);
            handleClose();
          },
        }}
      >
        <DialogTitle>폴더 수정</DialogTitle>
        <DialogContent>
          <DialogContentText>변경 후 폴더 이름</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="folderName"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={directory ? directory.name : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button type="submit">수정</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default EditDialog;
