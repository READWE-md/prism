import { useRef, useState, useEffect, FC } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import styled, { css } from "styled-components";
import CameraIcon from "@mui/icons-material/Camera";
import axios from "axios";

const StyledContainer = styled(Container)`
  position: relative;
  display: flex !important;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

interface VideoWrapperProps {
  $isDetected: boolean;
}

const VideoWrapper = styled.div<VideoWrapperProps>`
  border: 5px solid red;
  width: 90%;
  height: 480px;
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

const CameraShotButton = styled.button<{ $isDetected: boolean }>`
  position: relative;
  bottom: 2rem;
  background-color: lightgray;
  width: 20%;
  padding: 1rem;
  border-radius: 50%;
  align-items: center;
  ${(props) =>
    props.$isDetected &&
    css`
      background-color: tomato;
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

const Camera: FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isDetected, setIsDetected] = useState(false);
  const timeRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    initCamera();

    timeRef.current = setTimeout(() => {
      setIsDetected(true);
      console.log("detected!");
    }, 3000);

    return () => {
      // 컴포넌트가 언마운트되면 미디어 스트림 해제
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }
    };
  }, []);

  const capture = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");

    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL("image/png");
      console.log(dataURL);
      axios({
        method: "post",
        url: "http://localhost:8000/api/v1/contracts",
        data: {
          file: dataURL,
        },
      }).then((res) => {
        navigate("/result", { state: { data: res.data } });
      });
      // const a = document.createElement("a");
      // a.href = dataURL;
      // a.download = "capture.png";
      // console.log(a.href);
      // a.click();
    }
  };

  return (
    <StyledContainer>
      <VideoWrapper $isDetected={isDetected}>
        <DetectAlert $isDetected={isDetected}>인식 되었습니다</DetectAlert>
        <StyledVideo ref={videoRef} autoPlay playsInline></StyledVideo>
      </VideoWrapper>
      <CameraShotButton
        onClick={() => {
          capture();
        }}
        $isDetected={isDetected}
      >
        <CameraIcon />
      </CameraShotButton>
    </StyledContainer>
  );
};

export default Camera;
