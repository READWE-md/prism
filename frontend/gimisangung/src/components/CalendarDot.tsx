import styled from "styled-components";

const StartDotStyle = styled.span`
  height: 5px;
  width: 5px;
  background-color: #b23c64;
  border-radius: 50%;
  display: flex;
  margin-left: 1px;
`;

const EndDotStyle = styled.span`
  height: 5px;
  width: 5px;
  background-color: #1769aa;
  border-radius: 50%;
  display: flex;
  margin-left: 1px;
`;
interface Props {
  dotType: string;
}
const CalendarDot = ({ dotType }: Props) => {
  return dotType === "start" ? (
    <StartDotStyle></StartDotStyle>
  ) : (
    <EndDotStyle></EndDotStyle>
  );
};
export default CalendarDot;
