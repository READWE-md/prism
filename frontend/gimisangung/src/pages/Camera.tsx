import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PictureFrame from "../components/PictureFrame";
import loadingSpinner from "../assets/loadingSpinner.gif";
import axios from "axios";

const serverURL = process.env.REACT_APP_SERVER_URL;

const Wrapper = styled.section`
  width: 100%;
  height: 100%;
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
  position: relative;
  width: 100%;
  height: 70%;
  /* overflow: hidden; */
  justify-items: center;
`;

const StyledVideo = styled.video`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const StyledCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
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
  display: flex;
  align-items: center;
  justify-content: center;
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

const StyledButton = styled.button`
  background-color: black;
  border: none;
  margin-bottom: 5px;
`;

const LoadingImage = styled.img`
  height: 70%;
`;

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDetected, setIsDetected] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [pictureList, setPictureList] = useState<string[]>([]);
  const [sendSignal, setSendSignal] = useState<boolean>(false);
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
  };
  const BackButton = () => {
    return (
      <StyledButton
        onClick={() => {
          stopCamera();
          navigate("/home");
        }}
      >
        <ArrowBackIcon style={{ color: "white" }} />
      </StyledButton>
    );
  };

  useEffect(() => {
    if (state.pictureList) {
      setPictureList(state.pictureList);
      setCapturedImage(state.pictureList[state.pictureList.length - 1]);
    }
    const initCamera = async () => {
      try {
        const constraints = await getMaxResolutionConstraints();
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          if (videoRef.current && canvasRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            videoRef.current.play();
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    initCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const getMaxResolutionConstraints =
    async (): Promise<MediaStreamConstraints> => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
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
            facingMode: { ideal: "environment" },
          },
        };
      } catch (error) {
        console.error("Error getting max resolution constraints:", error);
        return { video: true };
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

        const imgUrl = canvasRef.current.toDataURL("image/jpeg", 0.5);
        setCapturedImage(imgUrl);
        addPicture(imgUrl);
        setIsDetected(false);
      }
    }
  };

  return (
    <Wrapper>
      <BackButton />

      <VideoWrapper $isDetected={isDetected}>
        <StyledVideo ref={videoRef} playsInline />
        <StyledCanvas ref={canvasRef} style={{ display: "none" }} />
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
        {sendSignal === false ? (
          <ConfirmButton
            onClick={() => {
              if (pictureList.length > 0) {
                setSendSignal(true);
                const payload = {
                  name: "새계약서" + Date.now(),
                  tags: [],
                  parentId: state.currentLocation,
                  images: pictureList,
                };
                axios
                  .post(`${serverURL}/api/v1/contracts`, payload, {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  })
                  .then((res) => {
                    stopCamera();
                    navigate("/home");
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } else {
                alert("계약서 사진을 찍은 후 보내주세요.");
              }
            }}
          >
            <ArrowForwardIcon fontSize="large" style={{ color: "#fff" }} />
          </ConfirmButton>
        ) : (
          <ConfirmButton>
            <LoadingImage src={loadingSpinner} alt="로딩중" />
          </ConfirmButton>
        )}
      </ButtonWrapper>
    </Wrapper>
  );
};

export default Camera;
