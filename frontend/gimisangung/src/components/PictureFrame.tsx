import React, { useRef, useEffect, useState } from "react";
import styled, { css } from "styled-components";

const Wrapper = styled.div`
  margin-top: 10%;
`;
const BlankFrame = styled.div`
  position: relative;
  background-color: #292929;
  width: 5rem;
  height: 5rem;
  border: 1px solid #161616;
  border-radius: 50%;
  text-align: center;
  overflow: hidden;
`;

interface BlankFrameProps {
  children?: React.ReactNode;
  length: number;
}

const PictureLength = styled.div`
  position: absolute;
  color: white;
  bottom: 15%;
  left: 21%;
  font-size: 1.8rem;
`;

const PictureFrame: React.FC<BlankFrameProps> = ({ children, length }) => {
  return (
    <Wrapper>
      <BlankFrame>{children}</BlankFrame>
      <PictureLength>{length !== 0 && length}</PictureLength>
    </Wrapper>
  );
};

export default PictureFrame;
