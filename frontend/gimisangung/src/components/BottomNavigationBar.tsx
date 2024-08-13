import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import EventNoteIcon from '@mui/icons-material/EventNote';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const BottomNavigationBar = () => {
  return (
    <BottomNavigation showLabels sx={{
        position:'absolute', bottom:'0px', width: '100%', borderRadius:'10px 10px 0 0',  boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
    }}>
        <BottomNavigationAction label="일정" icon={<EventNoteIcon />} />
        <BottomNavigationAction label="내 계약서" icon={<DescriptionIcon />} />
        <BottomNavigationAction label="계약서 추가" icon={<AddCircleOutlineIcon />} />
        <BottomNavigationAction label="탐색" icon={<SearchIcon />} />
    </BottomNavigation>
  );
};

export default BottomNavigationBar;
