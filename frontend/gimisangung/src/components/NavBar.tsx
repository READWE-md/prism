import React from "react";
import { useNavigate } from "react-router-dom";
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

const IconWrapper = styled.div`
  display: flex;
`;

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <BackButton />
      <IconWrapper>{/* <ProfileIcon /> */}</IconWrapper>
    </Wrapper>
  );
};
export default Navbar;
