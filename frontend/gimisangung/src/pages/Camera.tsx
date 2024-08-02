import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PictureFrame from "../components/PictureFrame";
import axios from "axios";
const serverURL = process.env.REACT_APP_SERVER_URL;

const Wrapper = styled.section`
  width: 100vw;
  height: 100vh;
  margin: auto;
  overflow: hidden;
  align-content: center;
  justify-content: center;
  background-color: black;
`;

interface VideoWrapperProps {
  $isDetected: boolean;
}

const VideoWrapper = styled.div<VideoWrapperProps>`
  border: 0.2rem solid red;
  width: 98%;
  height: 70%;
  overflow: hidden;
  justify-items: center;
  ${(props) =>
    props.$isDetected &&
    css`
      border-color: #00ff57;
    `};
`;

const StyledVideo = styled.video`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const CapturedImage = styled.img`
  width: 60%;
  height: 100%;
  object-fit: cover;
`;

const ButtonWrapper = styled.div`
  padding: 5%;
  display: flex;
  justify-content: space-between;
`;

const ConfirmButton = styled.div`
  background-color: #2b2b2b;
  width: 5rem;
  height: 5rem;
  border: 1px solid #161616;
  border-radius: 50%;
  margin-top: 10%;
  text-align: center;
`;

const CameraShotButton = styled.button<{ $isDetected: boolean }>`
  position: relative;
  background-color: lightgray;
  margin-top: 10%;
  width: 6rem;
  height: 6rem;
  padding: 1rem;
  border-radius: 50%;
  align-items: center;
  ${(props) =>
    props.$isDetected &&
    css`
      background-color: white;
    `};
`;

const DetectAlert = styled.span<{ $isDetected: boolean }>`
  position: absolute;
  left: 95px;
  top: 60px;
  height: 63px;
  width: 153px;
  background-color: #535353;
  text-align: center;
  color: white;
  align-content: center;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.2s ease;
  ${(props) =>
    props.$isDetected &&
    css`
      visibility: visible;
      opacity: 1;
    `};
`;

const StyledButton = styled.button`
  background-color: black;
  border: none;
  margin-bottom: 5px;
`;

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <StyledButton onClick={() => navigate("/home")}>
      <ArrowBackIcon style={{ color: "white" }} />
    </StyledButton>
  );
};

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDetected, setIsDetected] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const timeRef = useRef<NodeJS.Timeout | null>(null);
  const [pictureList, setPictureList] = useState<string[]>([]);
  const navigate = useNavigate();
  const { state } = useLocation();

  const addPicture = (newPicture: string) => {
    setPictureList((prevList) => [...prevList, newPicture]);
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }
  };

  useEffect(() => {
    if (state?.pictureList) {
      setPictureList(state.pictureList);
      setCapturedImage(state.pictureList[state.pictureList.length - 1]);
    }
    const initCamera = async () => {
      try {
        const constraints = await getMaxResolutionConstraints();
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.log(error);
      }
    };

    initCamera();

    timeRef.current = setTimeout(() => {
      setIsDetected(true);
      console.log("detected!");
    }, 3000);

    return () => {};
  }, []);

  const getMaxResolutionConstraints =
    async (): Promise<MediaStreamConstraints> => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: "environment" },
          },
        });

        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();

        const maxWidth = capabilities.width?.max || 1920;
        const maxHeight = capabilities.height?.max || 1080;

        stream.getTracks().forEach((track) => track.stop());

        return {
          video: {
            width: maxWidth,
            height: maxHeight,
          },
        };
      } catch (error) {
        console.error("Error getting max resolution constraints:", error);
        return { video: true }; // 기본적으로 비디오 스트림을 반환
      }
    };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        const imgUrl = canvasRef.current.toDataURL("image/jpeg");
        setCapturedImage(imgUrl);
        addPicture(imgUrl);

        setIsDetected(false);

        timeRef.current = setTimeout(() => {
          setIsDetected(true);
          console.log("detected!");
        }, 4000);
      }
    }
  };

  return (
    <Wrapper>
      <BackButton />
      <VideoWrapper $isDetected={isDetected}>
        <DetectAlert $isDetected={isDetected}>인식 되었습니다</DetectAlert>
        <StyledVideo ref={videoRef} autoPlay playsInline />
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </VideoWrapper>
      <ButtonWrapper>
        {capturedImage ? (
          <PictureFrame
            length={pictureList.length}
            clickHandler={() => {
              stopCamera();
              navigate("/gallery", {
                state: {
                  pictureList,
                  currentLocation: state.currentLocation,
                },
              });
            }}
          >
            <CapturedImage src={capturedImage} alt="Captured" />
          </PictureFrame>
        ) : (
          <PictureFrame
            length={pictureList.length}
            clickHandler={() => {
              console.log("no image");
            }}
          />
        )}
        <CameraShotButton onClick={capturePhoto} $isDetected={isDetected} />
        <ConfirmButton
          onClick={() => {
            axios
              .post(`${serverURL}/api/v1/contracts`, {
                name: "새계약서" + Date.now(),
                tags: ["하이"],
                parentId: state.currentLocation,
                images: pictureList,
              })
              .then((res) => {
                stopCamera();
                navigate("/home");
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          <ArrowForwardIcon
            fontSize="large"
            style={{ color: "#fff", marginTop: "25%" }}
          />
        </ConfirmButton>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default Camera;
