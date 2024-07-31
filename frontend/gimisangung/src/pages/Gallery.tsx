import { Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;
const NavContainer = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  flex-basis: 30px;
  background-color: blue;
`;
const MainContainer = styled.div`
  display: flex;
  position: relative;
  flex-basis: 500px;
  flex-grow: 5;
  background-color: black;
  align-items: center;
`;
const SubContainer = styled.div`
  display: flex;
  flex-basis: 60px;
  flex-grow: 1;
  background-color: yellow;
  overflow-x: auto;
`;
const SubImage = styled.img`
  height: 100%;
  width: auto;
`;
const MainImage = styled.img`
  width: 100%;
  object-fit: cover;
`;
const ImageIndexIndicator = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  color: white;
`;
const MoveNav = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
`;

const Gallery = () => {
  const { state } = useLocation();
  // const pictureList: string[] = state.pictureList;
  const [pictureList, setpictureList] = useState<string[]>(state.pictureList);
  const [bigImage, setBigImage] = useState(pictureList[0]);
  const navigate = useNavigate();
  const [imageIdx, setImageIdx] = useState(0);

  const moveForward = () => {
    const temp = pictureList;
    temp.splice(imageIdx - 1, 0, temp.splice(imageIdx, 1)[0]);
    console.log(temp);
    setpictureList(temp);
    setImageIdx((prev) => prev - 1);
  };
  const moveBackward = () => {
    const temp = pictureList;
    temp.splice(imageIdx + 1, 0, temp.splice(imageIdx, 1)[0]);
    setpictureList(temp);
    setImageIdx((prev) => prev + 1);
  };
  const deleteImage = () => {
    const temp = pictureList;
    temp.splice(imageIdx, 1);
    setpictureList(temp);
    if (imageIdx > 0) {
      setBigImage(pictureList[imageIdx - 1]);
      setImageIdx((prev) => prev - 1);
    } else {
      setBigImage(pictureList[0]);
    }
    if (pictureList.length === 0) {
      navigate("/camera");
    }
  };
  return (
    <Container>
      <NavContainer>
        <Button
          variant="contained"
          onClick={() => {
            navigate("/camera", {
              state: { pictureList, currentLocation: state.currentLocation },
            });
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            axios
              .post("http://localhost:8080/api/v1/contracts", {
                name: "새 계약서 " + Date.now(),
                tags: [],
                parentId: state.currentLocation,
                images: pictureList,
              })
              .then((res) => {
                navigate("/home");
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          분석하기
        </Button>
      </NavContainer>
      <MainContainer>
        <ImageIndexIndicator>
          {imageIdx + 1}/{pictureList.length}
        </ImageIndexIndicator>
        <MainImage src={bigImage} alt="main"></MainImage>
        <MoveNav>
          <Button
            variant="contained"
            onClick={moveForward}
            style={{ visibility: imageIdx > 0 ? "visible" : "hidden" }}
          >
            앞으로 이동
          </Button>

          <Button
            variant="contained"
            onClick={moveBackward}
            style={{
              visibility:
                imageIdx < pictureList.length - 1 ? "visible" : "hidden",
            }}
          >
            뒤로 이동
          </Button>
          <Button variant="contained" onClick={deleteImage}>
            삭제
          </Button>
        </MoveNav>
      </MainContainer>
      <SubContainer>
        {pictureList.map((e, idx) => (
          <SubImage
            onClick={() => {
              setBigImage(e);
              setImageIdx(idx);
            }}
            alt="img"
            src={e}
            key={"img" + idx}
          ></SubImage>
        ))}
      </SubContainer>
    </Container>
  );
};

export default Gallery;
