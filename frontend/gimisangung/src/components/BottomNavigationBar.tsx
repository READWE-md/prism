import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import DescriptionIcon from "@mui/icons-material/Description";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { useState } from "react";
import { Provider } from "react-redux";
import persistor, { RootState, store } from "../reducer";
import { PersistGate } from "redux-persist/integration/react";
import useCurrentLocation from "../hooks/useCurrentLocation";

const BottomNavigationBar = () => {
  const { path, pathName } = useSelector((state: RootState) => state.account);
  const currentLocation = useCurrentLocation();
  // const [currentLocation, setCurrentLocation] = useState<number>(
  //   path[path.length - 1]
  // );
  const location = useLocation();
  const navigate = useNavigate();
  const addContract = () => {
    navigate("/camera", { state: { currentLocation: currentLocation } });
  };
  const onChangeMenu = (menu: string) => {
    navigate(menu);
  };
  return (
    <BottomNavigation
      showLabels
      sx={{
        position: "fixed",
        bottom: "0px",
        width: "100%",
        borderRadius: "10px 10px 0 0",
        boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
      }}
    >
      <BottomNavigationAction
        onClick={() => onChangeMenu("/main")}
        label="일정"
        icon={<EventNoteIcon />}
        style={{
          backgroundColor:
            location.pathname === "/main" ? "lightgray" : undefined,
        }}
      />
      <BottomNavigationAction
        onClick={() => onChangeMenu("/home")}
        label="내 계약서"
        icon={<DescriptionIcon />}
        style={{
          backgroundColor:
            location.pathname === "/home" ? "lightgray" : undefined,
        }}
      />
      <BottomNavigationAction
        onClick={() => addContract()}
        label="계약서 추가"
        icon={<AddCircleOutlineIcon />}
      />
      <BottomNavigationAction
        onClick={() => onChangeMenu("/search")}
        label="탐색"
        icon={<SearchIcon />}
        style={{
          backgroundColor:
            location.pathname === "/search" ? "lightgray" : undefined,
        }}
      />
    </BottomNavigation>
  );
};

export default BottomNavigationBar;
