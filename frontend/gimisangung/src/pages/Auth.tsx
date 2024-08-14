import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { save } from "../reducer/account";
import styled from "styled-components";
import LinearProgress from "@mui/material/LinearProgress";

const Url = process.env.REACT_APP_LOGIN_URL;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #f8f8f8;
`;
const ProgressContainer = styled.div`
  width: 80%;
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
        navigate("/main");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    goHome();
    return () => {};
  }, []);

  return (
    <Container>
      <ProgressContainer>
        <LinearProgress />
      </ProgressContainer>
      <h3>로그인 중입니다.</h3>
    </Container>
  );
};

export default Auth;
