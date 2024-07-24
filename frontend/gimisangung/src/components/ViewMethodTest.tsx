import React, { ChangeEvent } from "react";
import styled from "styled-components";

// 스타일 컴포넌트 정의
const CustomCheckboxContainer = styled.div`
  width: 333px;
  height: 40px;
  position: relative;
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  display: none;
`;

const Label = styled.label`
  height: 100%;
  width: 100%;
`;

interface StatusSwitchProps {
  checked: boolean;
}

const StatusSwitch = styled.div<StatusSwitchProps>`
  cursor: pointer;
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #d9d9d9;
  transition: all 0.5s ease;
  padding: 3px;
  border-radius: 9px;

  color: #757575;
  font-family: "Inter-Bold", Helvetica;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: normal;

  &:before,
  &:after {
    border-radius: 15px;
    height: 33px;
    width: 147px;
    position: absolute;
    justify-content: center;
    align-content: center;
    transition: all 0.3s ease;
    content: attr(data-unchecked);
    top: 6px;
  }

  &:before {
    background-color: white;
    color: #757575;
    left: 3px;
    z-index: 10;
    left: 14px;
    /* top: 6px; */
  }

  &:after {
    right: 0;
    content: attr(data-checked);
  }

  ${HiddenCheckbox}:checked + ${Label} & {
    &:after {
      left: 0;
      content: attr(data-unchecked);
    }

    &:before {
      left: 50%;
      content: attr(data-checked);
    }
  }
`;

// React 컴포넌트 정의
const ViewMethodTest: React.FC = () => {
  const [checked, setChecked] = React.useState<boolean>(false);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <CustomCheckboxContainer>
      <HiddenCheckbox
        id="status"
        checked={checked}
        onChange={handleCheckboxChange}
      />
      <Label htmlFor="status">
        <StatusSwitch
          checked={checked}
          data-checked="원문에서 보기"
          data-unchecked="한 눈에 보기"
        />
      </Label>
    </CustomCheckboxContainer>
  );
};

export default ViewMethodTest;
