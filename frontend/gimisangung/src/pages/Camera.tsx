import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PictureFrame from "../components/PictureFrame";
import axios from "axios";

const serverURL = process.env.REACT_APP_SERVER_URL;
// declare var cv: any;
// declare var cv: any;
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
  /* border: 0.2rem solid red; */
  position: relative;
  width: 100%;
  height: 70%;
  /* overflow: hidden; */
  justify-items: center;
  /* ${(props) =>
    props.$isDetected &&
    css`
      border-color: #00ff57;
    `}; */
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

// const OverlayFrame = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   z-index: 2; /* Canvas나 Video보다 위에 위치하도록 설정 */
//   pointer-events: none; /* 오버레이가 클릭 이벤트를 가로채지 않도록 설정 */
//   background-color: rgba(0, 0, 0, 0.5); /* 어두운 배경색 설정 */
//   mask: linear-gradient(
//       to top,
//       rgb(0, 0, 0, 0.3) 0%,
//       rgb(0, 0, 0, 0.3) 12%,
//       transparent 12%,
//       transparent 88%,
//       rgb(0, 0, 0, 0.3) 88%,
//       rgb(0, 0, 0, 0.3) 100%
//     ),
//     linear-gradient(
//       to bottom,
//       rgba(0, 0, 0, 0.3) 0%,
//       rgba(0, 0, 0, 0.3) 12%,
//       transparent 12%,
//       transparent 88%,
//       rgba(0, 0, 0, 0.3) 88%,
//       rgba(0, 0, 0, 0.3) 100%
//     ),
//     linear-gradient(
//       to left,
//       rgba(0, 0, 0, 0.3) 0%,
//       rgba(0, 0, 0, 0.3) 12%,
//       transparent 12%,
//       transparent 88%,
//       rgba(0, 0, 0, 0.3) 88%,
//       rgba(0, 0, 0, 0.3) 100%
//     ),
//     linear-gradient(
//       to right,
//       rgba(0, 0, 0, 0.3) 0%,
//       rgba(0, 0, 0, 0.3) 12%,
//       transparent 12%,
//       transparent 88%,
//       rgba(0, 0, 0, 0.3) 88%,
//       rgba(0, 0, 0, 0.3) 100%
//     );
//   mask-size: 100% 100%;
//   mask-composite: exclude; /* 이 부분을 제외한 나머지 영역을 보여줌 */
//   -webkit-mask-composite: exclude; /* Safari 지원 */
// `;

// const OverlayInnerFrame = styled.div`
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   width: 80%;
//   height: 80%;
//   transform: translate(-50%, -50%);
//   border: 5px solid #ffffff; /* 빨간색 테두리 */
//   background-color: transparent; /* 투명한 배경 */
//   box-sizing: border-box;
//   pointer-events: none; /* 클릭 이벤트가 이 프레임에 의해 가로채지 않도록 설정 */
// `;

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
  // const innerFrameRef = useRef<HTMLDivElement | null>(null);
  const [isDetected, setIsDetected] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
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
    // let selectedRect: any = null;
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
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    // const startPaperDetection = () => {
    //   const processFrame = () => {
    //     if (videoRef.current && canvasRef.current) {
    //       const context = canvasRef.current.getContext("2d", {
    //         willReadFrequently: true,
    //       });
    //       if (context) {
    //         context.drawImage(
    //           videoRef.current,
    //           0,
    //           0,
    //           canvasRef.current.width,
    //           canvasRef.current.height
    //         );
    //         const src = cv.imread(canvasRef.current);
    //         const graySrc = new cv.Mat();
    //         cv.cvtColor(src, graySrc, cv.COLOR_RGBA2GRAY);

    //         // Gaussian Blur
    //         const blurredSrc = new cv.Mat();
    //         cv.GaussianBlur(graySrc, blurredSrc, new cv.Size(5, 5), 0);

    //         // Adaptive Thresholding
    //         const adaptiveThreshold = new cv.Mat();
    //         cv.adaptiveThreshold(
    //           blurredSrc,
    //           adaptiveThreshold,
    //           255,
    //           cv.ADAPTIVE_THRESH_GAUSSIAN_C,
    //           cv.THRESH_BINARY,
    //           11,
    //           2
    //         );
    //         const contours = new cv.MatVector();
    //         const hierarchy = new cv.Mat();
    //         cv.findContours(
    //           adaptiveThreshold,
    //           contours,
    //           hierarchy,
    //           cv.RETR_LIST,
    //           cv.CHAIN_APPROX_SIMPLE
    //         );

    //         let largestRect = null;
    //         let largestArea = 0.0;
    //         let canvasArea = canvasRef.current.width * canvasRef.current.height;
    //         for (let i = 0; i < contours.size(); i++) {
    //           const contour = contours.get(i);
    //           const area = cv.contourArea(contour, false);
    //           const peri = cv.arcLength(contour, true);
    //           const approx = new cv.Mat();
    //           cv.approxPolyDP(contour, approx, 0.02 * peri, true);
    //           if (approx.rows >= 4) {
    //             const rect = cv.boundingRect(approx);
    //             if (rect.x !== 0 || rect.y !== 0) {
    //               const aspectRatio = rect.width / rect.height;
    //               const canvasAspectRatio =
    //                 canvasRef.current.width / canvasRef.current.height;
    //               if (aspectRatio > 0.5 && aspectRatio < 2.0) {
    //                 if (area > largestArea) {
    //                   largestArea = area;
    //                   largestRect = rect;
    //                 }
    //               }
    //               approx.delete();
    //             }
    //           }
    //         }

    //         if (largestRect) {
    //           setIsDetected(true);
    //           const ctx = canvasRef.current.getContext("2d", {
    //             willReadFrequently: true,
    //           });
    //           if (ctx) {
    //             ctx.clearRect(
    //               0,
    //               0,
    //               canvasRef.current.width,
    //               canvasRef.current.height
    //             );
    //             ctx.strokeStyle = "#ff0000";
    //             ctx.lineWidth = 5;
    //             ctx.strokeRect(
    //               largestRect.x,
    //               largestRect.y,
    //               largestRect.width,
    //               largestRect.height
    //             );
    //             selectedRect = largestRect;
    //           }
    //         } else {
    //           setIsDetected(false);
    //           selectedRect = null;
    //         }

    //         // Memory cleanup
    //         src.delete();
    //         graySrc.delete();
    //         blurredSrc.delete();
    //         adaptiveThreshold.delete();
    //         contours.delete();
    //         hierarchy.delete();
    //       }
    //     }
    //   };

    //   const handleClick = (e: MouseEvent) => {
    //     if (canvasRef.current) {
    //       const rect = canvasRef.current.getBoundingClientRect();
    //       const x = e.clientX - rect.left;
    //       const y = e.clientY - rect.top;
    //   const handleClick = (e: MouseEvent) => {
    //     if (canvasRef.current) {
    //       const rect = canvasRef.current.getBoundingClientRect();
    //       const x = e.clientX - rect.left;
    //       const y = e.clientY - rect.top;

    //       if (context && contours.size() > 0) {
    //         let selectedContour = null;
    //         for (let i = 0; i < contours.size(); i++) {
    //           const contour = contours.get(i);
    //           const contourRect = cv.boundingRect(contour);

    //           // 클릭한 위치가 현재 컨투어의 사각형 내부인지 확인
    //           if (
    //             x >= contourRect.x &&
    //             x <= contourRect.x + contourRect.width &&
    //             y >= contourRect.y &&
    //             y <= contourRect.y + contourRect.height
    //           ) {
    //             selectedContour = contour;
    //             break; // 첫 번째로 발견된 컨투어를 선택
    //           }
    //         }

    //         if (selectedContour) {
    //           const ctx = canvasRef.current.getContext("2d", {
    //             willReadFrequently: true,
    //           });
    //           if (ctx) {
    //             ctx.clearRect(
    //               0,
    //               0,
    //               canvasRef.current.width,
    //               canvasRef.current.height
    //             );
    //             ctx.strokeStyle = "#00ff00"; // 선택된 컨투어에 초록색 테두리
    //             ctx.lineWidth = 5;
    //             const selectedRect = cv.boundingRect(selectedContour);
    //             ctx.strokeRect(
    //               selectedRect.x,
    //               selectedRect.y,
    //               selectedRect.width,
    //               selectedRect.height
    //             );
    //           }
    //         }
    //       }
    //     }
    //   };

    //   if (canvasRef.current) {
    //     canvasRef.current.addEventListener("click", handleClick);
    //   }
    //   const intervalId = setInterval(processFrame, 300); // 1000ms = 1초

    //   return () => {
    //     clearInterval(intervalId);
    //     if (canvasRef.current) {
    //       canvasRef.current.removeEventListener("click", handleClick);
    //     }
    //   }; // 컴포넌트 언마운트 시 interval 정리
    // };
    //   return () => {
    //     clearInterval(intervalId);
    //     if (canvasRef.current) {
    //       canvasRef.current.removeEventListener("click", handleClick);
    //     }
    //   }; // 컴포넌트 언마운트 시 interval 정리
    // };

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

        const imgUrl = canvasRef.current.toDataURL("image/png", 0.5);
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
        {/* <DetectAlert $isDetected={isDetected}>인식 되었습니다</DetectAlert> */}
        <StyledVideo ref={videoRef} autoPlay playsInline />
        <StyledCanvas ref={canvasRef} style={{ display: "none" }} />
        {/* <OverlayFrame>
          <OverlayInnerFrame ref={innerFrameRef} />
        </OverlayFrame> */}
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
            const payload = {
              name: "새계약서" + Date.now(),
              tags: [],
              parentId: state.currentLocation,
              images: pictureList,
            };
            console.log("payload=", payload);
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
