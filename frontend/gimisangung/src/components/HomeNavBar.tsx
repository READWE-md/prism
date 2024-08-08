import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";

const Wrapper = styled.div`
  display: flex;
  justify-content: end;
  padding: 3px;
`;
const ProfileIcon = styled(AccountCircleIcon)`
  color: white;
  background-color: black;
  border-radius: 50%;
`;

const IconWrapper = styled.div`
  display: flex;
`;

const StyledSearchIcon = styled(SearchIcon)`
  /* margin-right: 1rem; */
`;

const HomeNavbar = () => {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <IconWrapper>
        <StyledSearchIcon onClick={() => navigate("/search")} />
        {/* <ProfileIcon /> */}
      </IconWrapper>
    </Wrapper>
  );
};
export default HomeNavbar;
