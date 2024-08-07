import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { save } from "../reducer/account";
import styled from "styled-components";

const Url = process.env.REACT_APP_LOGIN_URL;
const serverURL = process.env.REACT_APP_SERVER_URL;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  perspective: -2000px;
`;

const Page = styled.div`
  position: absolute;
  width: 100%;
  height: 800px;
`;

const Page1 = styled(Page)`
  background-color: yellow;
  z-index: 1;
  transform-origin: left center;
  transition-duration: 1s;
  transition-timing-function: ease-in;
  &:hover {
    transform: rotateY(-180deg);
    opacity: 0.4;
  }
`;

const Page2 = styled(Page)`
  background-color: green;
  z-index: 0;
`;
const Auth = () => {
  const params = new URL(document.URL).searchParams;
  const code = params.get("code");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const goHome = () => {
    axios({
      method: "post",
      url: Url,
      data: {
        code,
      },
    })
      .then((res) => {
        dispatch(
          save(
            res.data.username,
            [res.data.rootDirectoryId],
            ["홈"],
            res.data.email,
            res.data.id
          )
        );
      })
      .then((res) => {
        navigate("/home");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    goHome();
    return () => {};
  }, []);

  const onHandleClick = () => {};

  return (
    <Container>
      {/* <Page1 onClick={onHandleClick}>upper</Page1>
      <Page2>lower</Page2> */}
      <h1>Redirect중</h1>
      <p>{code}</p>
    </Container>
  );
};

export default Auth;
