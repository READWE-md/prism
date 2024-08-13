import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import NavBar from "../components/NavBar";
import BluePrimaryBtn from "../components/BluePrimaryBtn";
import { useSelector } from "react-redux";
import { RootState } from "../reducer";

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

const StyledForm = styled.div`
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
  height: 1.3rem;
  text-align: center;
  align-content: center;
  margin-top: 0.4rem;
`;

const TagInput = styled.input`
  font-size: 12px;
  margin-left: 0.4rem;
  border-radius: 15px;
  padding: 0.1rem 0.3rem;
  background-color: white;
  width: auto;
  text-align: center;
  align-content: center;
  border: none;
  width: 3rem;
  height: 1.3rem;
  &:focus {
    outline: none;
  }
  margin-top: 0.4rem;
`;

const StyledDiv = styled.div`
  border: none;
  background-color: #f8f8f8;
  border-bottom: 1px solid lightgray;
  margin-bottom: 2rem;
  padding-top: 0.5rem;
  padding-bottom: 0.3rem;
  width: 80%;
  height: auto;
  display: flex;
  flex-wrap: wrap;
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

const PlusButton = styled.button`
  border: none;
  background-color: #f8f8f8;
  font-size: x-large;
`;

const TagLabelWraaper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
`;

const EditPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [newTag, setNewTag] = useState<string>("");
  const [inputVisible, setInputVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { path } = useSelector((state: RootState) => state.account);

  const contract = state.data;
  const [name, setName] = useState<string>(contract.name);
  const [tags, setTags] = useState<string[]>(contract.tags);
  let temp: number[];
  if (contract.parentId) {
    temp = [contract.parentId];
  } else {
    temp = [path[path.length - 1]];
  }

  const [directoryPathName, setDirectoryPathName] = useState<string[]>([]);

  const fetchDirectoryPath = async () => {
    let i = 0;
    const tempDirPath = temp;
    const tempDirPathName = [];
    while (i < 20) {
      try {
        let res = await axios({
          method: "get",
          url: `${serverURL}/api/v1/directories/${tempDirPath[0]}`,
        });

        if (res.data.parentId === null) {
          tempDirPathName.unshift("홈");
          break;
        } else {
          tempDirPathName.unshift(res.data.name);
          tempDirPath.unshift(res.data.parentId);
        }
      } catch (err) {
        console.log(err);
        break;
      }

      i++;
    }
    setDirectoryPathName(tempDirPathName);
    // setDirectoryPath(tempDirPath);
  };
  useEffect(() => {
    fetchDirectoryPath();
    // if (directoryPath.length > 0) {
    // }
  }, []);

  useEffect(() => {
    if (inputVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputVisible]);

  const editContract = () => {
    axios({
      method: "put",
      url: `${serverURL}/api/v1/contracts/${contract.id}`,
      data: {
        name,
        tags,
      },
    })
      .then((res) => navigate("/home"))
      .catch((err) => console.log(err));
  };

  const deleteTag = (idx: number) => {
    setTags((prevTags) => prevTags.filter((_, index) => index !== idx));
  };

  const addTag = () => {
    console.log(newTag.trim());
    if (newTag.trim() !== "") {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
      setInputVisible(false);
    }
  };

  return (
    <StyledScreen>
      <NavBar />
      <StyledH2>계약서 수정</StyledH2>
      <Wrapper>
        <StyledForm>
          <StyledLabel>제목</StyledLabel>
          <StyledInput
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></StyledInput>
          <TagLabelWraaper>
            <StyledLabel>태그</StyledLabel>
            <PlusButton onClick={() => setInputVisible(true)}>+</PlusButton>
          </TagLabelWraaper>
          <StyledDiv>
            {tags.map((e, idx) => (
              <Tag key={idx} style={{ display: e === "." ? "none" : "block" }}>
                {e}
                {idx < 4 ? null : (
                  <DeleteTag onClick={() => deleteTag(idx)}>x</DeleteTag>
                )}
              </Tag>
            ))}
            {inputVisible && (
              <TagInput
                style={{ visibility: inputVisible ? "visible" : "hidden" }}
                ref={inputRef}
                type="text"
                value={newTag || ""}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTag();
                  }
                }}
                onBlur={() => {
                  if (newTag) {
                    addTag();
                  } else {
                    setInputVisible(false);
                  }
                }}
              />
            )}
          </StyledDiv>
          <StyledLabel>저장 경로</StyledLabel>
          <StyledInput
            disabled
            type="text"
            value={directoryPathName.join("/")}
          ></StyledInput>
          <BluePrimaryBtn
            text="수정"
            onclick={() => editContract()}
          ></BluePrimaryBtn>
        </StyledForm>
      </Wrapper>
    </StyledScreen>
  );
};

export default EditPage;
