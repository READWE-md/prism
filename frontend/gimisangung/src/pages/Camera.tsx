import React, { useRef, useEffect, useState, createElement } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "axios";

import PictureFrame from "../components/PictureFrame";
import BackButton from "../components/WhiteBackButton";

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

const Camera: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDetected, setIsDetected] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const timeRef = useRef<NodeJS.Timeout | null>(null);
  const [pictureList, setPictureList] = useState<string[]>([]);
  const navigate = useNavigate();

  const addPicture = (newPicture: string) => {
    setPictureList((prevList) => [...prevList, newPicture]);
  };
  const [co, setCo] = useState<any>(null);

  useEffect(() => {
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

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }
    };
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

        canvasRef.current.toBlob((blob) => {
          if (blob) {
            if (blob.type === "image/jpeg") {
              const imgURL = URL.createObjectURL(blob);
              setCapturedImage(imgURL);
              addPicture(imgURL);
              console.log(blob);
              console.log(pictureList);
              // const a = document.createElement("a");
              // a.href = imgURL;
              // a.download = "capture.jpeg";
              // console.log(a.href);
              // a.click();
            } else {
              console.error("Unsupported MIME type:", blob.type);
            }
          }
        }, "image/jpeg");

        setIsDetected(false);

        timeRef.current = setTimeout(() => {
          setIsDetected(true);
          console.log("detected!");
        }, 4000);
      }
    }
  };

  const Confirm = () => {
    axios({
      method: "post",
      url: "http://localhost:8000/api/v1/contracts",
      data: {
        files: pictureList,
      },
    })
      .then((res) => {
        navigate("/result", { state: { data: res.data } });
      })
      .catch((error) => {
        console.error("Error sending data to backend:", error);
      });
  };

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const fetchDevices = async () => {
      const devicesList = await navigator.mediaDevices.enumerateDevices();
      setDevices(devicesList);
    };

    fetchDevices();
  }, []);

  return (
    <Wrapper>
      <BackButton />
      <VideoWrapper $isDetected={isDetected}>
        <DetectAlert $isDetected={isDetected}>인식 되었습니다</DetectAlert>
        <StyledVideo ref={videoRef} autoPlay playsInline />
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </VideoWrapper>
      <h1 style={{ color: "white" }}>{co}</h1>
      <ButtonWrapper>
        {capturedImage ? (
          <PictureFrame length={pictureList.length}>
            <CapturedImage src={capturedImage} alt="Captured" />
          </PictureFrame>
        ) : (
          <PictureFrame length={pictureList.length} />
        )}
        {/* <div style={{ color: "white" }}>
          {devices.map((device) => (
            <div key={device.deviceId}>
              <span>{device.deviceId}</span>
              <span>{device.label}</span>
            </div>
          ))}
        </div> */}
        <CameraShotButton onClick={capturePhoto} $isDetected={isDetected} />
        {/* <ConfirmButton
          onClick={Confirm} // Confirm 함수 호출로 수정
        > */}
        <ConfirmButton
          onClick={() => {
            navigate("/result", {
              state: {
                data: {
                  contractId: 314848454,
                  filepath: "http://naver.com",
                  poisons: [
                    {
                      content:
                        "제2조 (업무범위) 4. 'A'의 관리, 'A'의 관계사, 자회사 기타 투자 등 동 법인의 관리 및 동일한 업무를 상호 협의하여 부여할 수 있으며, 동 업무의 수행에 수반되어지는 각종 권리 의무는 본 계약의 규정을 준용토록 한다.",
                      result:
                        "이 조항은 근로자의 업무 범위를 매우 광범위하게 설정하고 있어, 근로자가 예상치 못한 과도한 업무를 부여받을 위험이 있습니다. 이는 근로자의 업무 부담을 크게 증가시킬 수 있으며, 명확한 업무 범위를 설정하지 않아 분쟁의 소지가 될 수 있습니다.",
                      boxes: [
                        {
                          ltx: 103,
                          lty: 463,
                          rbx: 882,
                          rby: 560,
                          page: 1,
                        },
                      ],
                      confidence_score: 0.8,
                    },
                    {
                      content:
                        "제3조 (직위와 보수) 2. 나. 인센티브 임금 원정 (￥_______)",
                      result:
                        "인센티브 임금이 명확하게 기재되어 있지 않고, '상호 협의하여 조정될' 수 있다는 표현은 회사 측이 일방적으로 인센티브를 결정할 여지를 남겨두고 있습니다. 이는 근로자의 보수 안정성을 해칠 수 있는 독소 조항입니다.",
                      boxes: [
                        {
                          ltx: 153,
                          lty: 983,
                          rbx: 884,
                          rby: 1232,
                          page: 1,
                        },
                      ],
                      confidence_score: 0.8,
                    },
                    {
                      content:
                        "제3조 (직위와 보수) 4. 전항의 각 약정보수의 지급은 다음 각호의 절차에 따라 지급키로 한다. 가. 연봉은 연봉의 1/12 (제수수 포함)를 매월 일괄 지급 나. 인센티브는 연1회 고과평가 완료 후, 30일 이내 지급",
                      result:
                        "연봉 지급 방식과 인센티브 지급 시기가 불명확하여, 근로자는 실제로 언제, 어떻게 보수를 받을 수 있는지 명확하지 않습니다. 이는 근로자의 생활 안정에 부정적인 영향을 미칠 수 있습니다.",
                      boxes: [
                        {
                          ltx: 155,
                          lty: 1111,
                          rbx: 675,
                          rby: 1184,
                          page: 1,
                        },
                      ],
                      confidence_score: 0.8,
                    },
                    {
                      content:
                        "제3조 (직위와 보수) 5. 'A'는 'B'의 업무효율 등을 위하여 교통수단 등을 제공할 수 있으며, 동 교통수단의 이용 등에 대하여는 'A'의 내부 관계규정에 따로 상세히 규정하고, 이용토록 하여야 한다.",
                      result:
                        "교통수단 제공에 대한 구체적인 조건이 명시되지 않아, 근로자가 자비로 교통수단을 마련해야 할 가능성이 있습니다. 이는 근로자의 경제적 부담을 증가시킬 수 있는 독소 조항입니다.",
                      boxes: [
                        {
                          ltx: 155,
                          lty: 1229,
                          rbx: 883,
                          rby: 1278,
                          page: 1,
                        },
                      ],
                      confidence_score: 0.8,
                    },
                  ],
                },
              },
            });
          }} // Confirm 함수 호출로 수정
        >
          <ArrowForwardIcon
            fontSize="large"
            style={{ color: "#fff", marginTop: "25%" }}
          />
        </ConfirmButton>
      </ButtonWrapper>
      <div style={{ color: "white" }}>
        {devices.map((device) => (
          <div key={device.deviceId}>
            <p>{device.deviceId}</p>
            <p>{device.label}</p>
          </div>
        ))}
      </div>
    </Wrapper>
  );
};

export default Camera;
