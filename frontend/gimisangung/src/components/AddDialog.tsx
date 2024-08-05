import React, { useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const serverURL = process.env.REACT_APP_SERVER_URL;

interface AddDialogProps {
  opendialog: boolean;
  onClose: () => void;
  currentLocation: number;
  checkDialog: boolean;
  setCheckDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddDialog = ({
  opendialog,
  onClose,
  currentLocation,
  checkDialog,
  setCheckDialog,
}: AddDialogProps) => {
  const [open, setOpen] = React.useState(opendialog);
  const parentId = currentLocation;

  const addFolder = (folderName: string, parentId: number) => {
    axios({
      method: "post",
      url: `${serverURL}/api/v1/directories`,
      data: {
        name: folderName,
        parentId,
      },
    })
      .then((res) => {
        setCheckDialog(true);
      })
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
            addFolder(folderName, parentId);
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

export default AddDialog;
