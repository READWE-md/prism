import type { FC } from "react";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import styled from "styled-components";

const NewContainer = styled(Container)`
  background-color: #dcdada;
  padding: 3px;
  text-align: center;
`;

const Navbar: FC = () => {
  return (
    <NewContainer>
      <h2>기미상궁</h2>
    </NewContainer>
  );
};
export default Navbar;
