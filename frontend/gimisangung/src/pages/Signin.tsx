import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useDispatch } from "react-redux";
import { save } from "../reducer/account";

import SkybluePrimaryBtn from "../components/SkybluePrimaryBtn";
import BlackBackButton from "../components/BlackBackButton";

const serverURL = process.env.REACT_APP_SERVER_URL;

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

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const signIn = async () => {
    if (password !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }
    axios({
      method: "post",
      url: `${serverURL}/api/v1/users`,
      data: {
        username,
        email,
        password,
      },
    })
      .then((res) =>
        dispatch(
          save(
            res.data.username,
            [res.data.rootDirectoryId],
            ["홈"],
            res.data.email,
            res.data.id
          )
        )
      )
      .then((res) => navigate("/home"))
      .catch((err) => console.log(err))
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn();
  };

  return (
    <StyledScreen>
      <BlackBackButton />
      <Wrapper>
        <StyledForm onSubmit={handleSubmit}>
          <StyledLabel>이름</StyledLabel>
          <StyledInput
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="이름을 입력해주세요"
          />
          <StyledLabel>이메일</StyledLabel>
          <StyledInput
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요"
          />
          <StyledLabel>비밀번호</StyledLabel>
          <StyledInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해 주세요"
          />
          <StyledLabel>비밀번호 확인</StyledLabel>
          <StyledInput
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="위와 동일한 비밀번호를 입력해 주세요"
          />
          {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
          <SkybluePrimaryBtn text="가입하기" />
        </StyledForm>
      </Wrapper>
    </StyledScreen>
  );
};

export default Signin;
