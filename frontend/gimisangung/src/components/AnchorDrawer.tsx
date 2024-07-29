import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

type Anchor = "bottom";

interface Contract {
  id: string;
  title: string;
  file_path: string;
  created_at: string;
}

interface AnchorDrawerProps {
  open: boolean;
  toggleDrawer: (open: boolean) => void;
  contract: Contract | null;
}

const AnchorDrawer: React.FC<AnchorDrawerProps> = ({
  open,
  toggleDrawer,
  contract,
}) => {
  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={() => toggleDrawer(false)}
      onKeyDown={() => toggleDrawer(false)}
    >
      <List>
        {["이동하기", "수정하기", "삭제하기"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer anchor="bottom" open={open} onClose={() => toggleDrawer(false)}>
      {contract && (
        <Box p={2}>
          <h4>{contract.title}</h4>
        </Box>
      )}
      {list("bottom")}
    </Drawer>
  );
};

export default AnchorDrawer;
