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
  /* overflow: hidden; */
`;

interface BlankFrameProps {
  children?: React.ReactNode;
  length: number;
  clickHandler: () => void;
}

const PictureLength = styled.div`
  position: absolute;
  color: white;
  top: 0;
  right: 0;
  font-size: 1.8rem;
`;

const PictureFrame: React.FC<BlankFrameProps> = ({
  children,
  length,
  clickHandler,
}) => {
  return (
    <Wrapper onClick={clickHandler}>
      <BlankFrame>
        {children} <PictureLength>{length !== 0 && length}</PictureLength>
      </BlankFrame>
    </Wrapper>
  );
};

export default PictureFrame;
