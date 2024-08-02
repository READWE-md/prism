import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import SkybluePrimaryBtn from "../components/SkybluePrimaryBtn";
import BlackBackButton from "../components/BlackBackButton";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../reducer";
import { add, remove } from "../reducer/account";

const serverURL = process.env.REACT_APP_SERVER_URL;

const StyledScreen = styled.div`
  background-color: #f8f8f8;
  height: 100vh;
  padding: 1rem;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 75%;
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

const StyledH2 = styled.h2`
  margin: 1rem;
`;

const Tag = styled.div`
  font-size: 12px;
  margin-left: 0.4rem;
  border-radius: 15px;
  padding: 0.1rem 0.3rem;
  background-color: white;
  width: auto;
  text-align: center;
  align-content: center;
`;

const StyledDiv = styled.div`
  border: none;
  background-color: #f8f8f8;
  border-bottom: 1px solid lightgray;
  margin-bottom: 2rem;
  padding-top: 0.5rem;
  padding-bottom: 0.3rem;
  width: 80%;
  height: 2rem;
  display: flex;
  &:focus {
    outline: none;
    border-bottom: 1px solid #3fa2f6;
  }
`;

const DeleteTag = styled.button`
  text-align: center;
  border: none;
  background-color: white;
`;

const EditPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [title, setTitle] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [directoryPath, setDirectoryPath] = useState<number[]>([]);
  const [directoryPathName, setDirectoryPathName] = useState<string[]>([]);
  const { path, pathName } = useSelector((state: RootState) => state.account);

  const dispatch = useDispatch();
  const contract = state.data;
  useEffect(() => {
    setTitle(contract.title);
    setTags(contract.tags);
    setDirectoryPathName(pathName);
    setDirectoryPath(path);
  }, []);
  const editContract = () => {
    axios({
      method: "put",
      url: `${serverURL}/api/v1/contracts/${contract.id}`,
      data: {
        title,
        tags,
        parentId: directoryPath[directoryPath.length - 1],
      },
    })
      .then((res) => navigate("/home"))
      .catch((err) => console.log(err));
  };
  return (
    <StyledScreen>
      <BlackBackButton></BlackBackButton>
      <StyledH2>계약서 수정</StyledH2>
      <Wrapper>
        <StyledForm
          onSubmit={(e) => {
            e.preventDefault();
            editContract();
          }}
        >
          <StyledLabel>제목</StyledLabel>
          <StyledInput
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></StyledInput>
          <StyledLabel>저장 경로</StyledLabel>
          <StyledInput
            type="text"
            value={directoryPathName.join("/")}
            onChange={(e) => setDirectoryPathName(e.target.value.split("/"))}
          ></StyledInput>
          <StyledLabel>태그</StyledLabel>

          <StyledDiv>
            {tags.map((e) => (
              <Tag>
                {e}
                <DeleteTag>x</DeleteTag>
              </Tag>
            ))}
          </StyledDiv>
          <SkybluePrimaryBtn text="수정"></SkybluePrimaryBtn>
        </StyledForm>
      </Wrapper>
    </StyledScreen>
  );
};

export default EditPage;
