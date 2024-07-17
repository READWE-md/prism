import { useRef, useState, useEffect, FC } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import styled, { css } from "styled-components";
import CameraIcon from "@mui/icons-material/Camera";

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
      console.log("ok");
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

  const toggleCamera = () => {
    if (videoRef.current) {
      if (isCameraOn) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      } else {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          videoRef.current!.srcObject = stream;
        });
      }
    }
    setIsCameraOn((prevState) => !prevState);
  };

  return (
    <StyledContainer>
      <VideoWrapper $isDetected={isDetected}>
        <DetectAlert $isDetected={isDetected}>인식 되었습니다</DetectAlert>
        <StyledVideo ref={videoRef} autoPlay playsInline></StyledVideo>
      </VideoWrapper>
      <CameraShotButton
        onClick={() => {
          const exampleData = {
            statusCode: 200,
            id: 1,
            summary:
              "김철수(이하 '을')은 이짱구(이하 '갑')에게 노동을 제공한다. 계약 기간은 1년이며, ...",
            filepath: "./contracts/contract_1.pdf",
            poisons: [
              {
                content: "계약서 내용 중 일부 독소 조항",
                boxes: [
                  {
                    ltx: 10,
                    lty: 20,
                    rbx: 30,
                    rby: 40,
                  },
                ],
                result: "위험",
                confidence_score: 92,
              },
              {
                content: "또 다른 독소 조항",
                boxes: [
                  {
                    ltx: 15,
                    lty: 25,
                    rbx: 35,
                    rby: 45,
                  },
                ],
                result: "위험",
                confidence_score: 88,
              },
            ],
          };
          navigate("/result", { state: { data: exampleData } });
        }}
        $isDetected={isDetected}
      >
        <CameraIcon />
      </CameraShotButton>
      {/* <Button onClick={toggleCamera}>
        {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
      </Button> */}
      {/* <Button
        onClick={() => {
          setIsDetected((prevState) => !prevState);
        }}
      >
        is Detected
      </Button> */}
    </StyledContainer>
  );
};

export default Camera;
