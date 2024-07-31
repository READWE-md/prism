import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import SkybluePrimaryBtn from "../components/SkybluePrimaryBtn";
import BlackBackButton from "../components/BlackBackButton";

const StyledScreen = styled.div`
  background-color: #f8f8f8;
  height: 100vh;
  padding: 1rem;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 90%;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledInput = styled.input`
  border: none;
  background-color: #f8f8f8;
  border-bottom: 1px solid lightgray;
  margin-bottom: 2rem;
  width: 80%;
  height: 2rem;
  &::placeholder {
    color: #ccc;
  }
  &:focus {
    outline: none;
    border-bottom: 1px solid #3fa2f6;
  }
`;

const StyledLabel = styled.label`
  color: #585858;
  display: block;
  width: 80%;
  text-align: left;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    axios({
      method: "post",
      url: "http://127.0.0.1:8080/api/v1/users/login",
      params: {
        email,
        password,
      },
    })
      .then((res) => {
        axios({
          method: "get",
          url: "http://127.0.0.1:8080/api/v1/users",
        })
          .then((res) =>
            navigate("/home", {
              state: {
                username: res.data.username,
                current: [res.data.rootDirectoryId],
              },
            })
          )
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <StyledScreen>
      <BlackBackButton></BlackBackButton>
      <Wrapper>
        <StyledForm
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
        >
          <StyledLabel>이메일</StyledLabel>
          <StyledInput
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요"
          ></StyledInput>
          <StyledLabel>비밀번호</StyledLabel>
          <StyledInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해 주세요"
          ></StyledInput>
          <SkybluePrimaryBtn text="로그인"></SkybluePrimaryBtn>
        </StyledForm>
      </Wrapper>
    </StyledScreen>
  );
};

export default Login;
