import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ArrowLeft, ArrowRight, ArrowBack } from "@mui/icons-material/";
const serverURL = process.env.REACT_APP_SERVER_URL;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: black;
`;
const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.5rem;
  flex-grow: 1;
  flex-basis: 30px;
  background-color: black;
`;
const MainContainer = styled.div`
  display: flex;
  position: relative;
  flex-basis: 500px;
  flex-grow: 5;
  align-items: center;
`;
const SubContainer = styled.div`
  display: flex;
  flex-basis: 60px;
  flex-grow: 1;
  background-color: black;
  overflow-x: auto;
`;

interface SubImageProps {
  $selected: boolean;
}
const SubImage = styled.img<SubImageProps>`
  height: 100%;
  width: auto;
  filter: ${(props) =>
    props.$selected ? "brightness(150%)" : "brightness(100%)"};
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
  bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const BackBtn = styled.button`
  background-color: transparent;
  color: white;
  padding: 0.5rem;
  border: 0;
  border-radius: 5px;
  height: 60%;
  font-weight: bold;
  border: none;
`;
const DoneBtn = styled.button`
  background-color: transparent;
  color: #0064ff;
  padding: 0.5rem;
  border: 0;
  border-radius: 5px;
  width: 6rem;
  height: 60%;
  font-weight: 600;
`;

const DelBtn = styled.button`
  background-color: red;
  color: white;
  padding: 0.5rem;
  border: 0;
  border-radius: 5px;
  width: 6rem;
  font-weight: bold;
`;

const ImgNav = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  top: 50%;
  display: flex;
  justify-content: space-between;
  width: 95%;
`;

const ArrowLeftIcon = styled(ArrowLeft)`
  background-color: white;
  border-radius: 50%;
`;
const ArrowRightIcon = styled(ArrowRight)`
  background-color: white;
  border-radius: 50%;
`;

const SubImageContainer = styled.div`
  position: relative;
  display: flex;
`;

const PicIdx = styled.div`
  position: absolute;
  color: black;
  top: 0;
  left: 0;
  font-weight: bold;
  color: #0064ff;
`;

const Gallery = () => {
  const { state } = useLocation();
  const [pictureList, setpictureList] = useState<string[]>(state.pictureList);
  const [bigImage, setBigImage] = useState(pictureList[0]);
  const navigate = useNavigate();
  const [imageIdx, setImageIdx] = useState(0);

  const moveForward = () => {
    const temp = pictureList;
    temp.splice(imageIdx - 1, 0, temp.splice(imageIdx, 1)[0]);
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
      navigate("/camera", {
        state: { pictureList, currentLocation: state.currentLocation },
      });
    }
  };

  return (
    <Container>
      <NavContainer>
        <BackBtn
          onClick={() => {
            // console.log("pictureList", pictureList);
            navigate("/camera", {
              state: { pictureList, currentLocation: state.currentLocation },
            });
          }}
        >
          <ArrowBack />
        </BackBtn>
        <DoneBtn
          onClick={() => {
            axios
              .post(`${serverURL}/api/v1/contracts`, {
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
        </DoneBtn>
      </NavContainer>
      <MainContainer>
        <ImageIndexIndicator>
          {imageIdx + 1}/{pictureList.length}
        </ImageIndexIndicator>
        <MainImage src={bigImage} alt="main"></MainImage>
        <ImgNav>
          <ArrowLeftIcon
            onClick={() => {
              setBigImage(pictureList[imageIdx - 1]);
              setImageIdx((prev) => prev - 1);
            }}
            style={{ visibility: imageIdx === 0 ? "hidden" : "visible" }}
          />
          <ArrowRightIcon
            onClick={() => {
              setBigImage(pictureList[imageIdx + 1]);
              setImageIdx((prev) => prev + 1);
            }}
            style={{
              visibility:
                imageIdx === pictureList.length - 1 ? "hidden" : "visible",
            }}
          />
        </ImgNav>
        <MoveNav>
          <Button
            variant="contained"
            onClick={moveForward}
            style={{ visibility: imageIdx > 0 ? "visible" : "hidden" }}
          >
            순서 앞으로
          </Button>
          <DelBtn onClick={deleteImage}>삭제</DelBtn>
          <Button
            variant="contained"
            onClick={moveBackward}
            style={{
              visibility:
                imageIdx < pictureList.length - 1 ? "visible" : "hidden",
            }}
          >
            순서 뒤로
          </Button>
        </MoveNav>
      </MainContainer>
      <SubContainer>
        {pictureList.map((e, idx) => (
          <SubImageContainer key={"div" + idx}>
            <SubImage
              onClick={() => {
                setBigImage(e);
                setImageIdx(idx);
              }}
              alt="img"
              src={e}
              key={"img" + idx}
              $selected={idx === imageIdx ? true : false}
            ></SubImage>
            <PicIdx key={"key" + idx}>{idx + 1}</PicIdx>
          </SubImageContainer>
        ))}
      </SubContainer>
    </Container>
  );
};

export default Gallery;
