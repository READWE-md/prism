import React from "react";
import styled from "styled-components";
import BackButton from "./BlackBackButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 3px;
`;
const ProfileIcon = styled(AccountCircleIcon)`
  color: white;
  background-color: black;
  border-radius: 50%;
`;

const Navbar = () => {
  return (
    <Wrapper>
      <BackButton />
      <ProfileIcon />
    </Wrapper>
  );
};
export default Navbar;
