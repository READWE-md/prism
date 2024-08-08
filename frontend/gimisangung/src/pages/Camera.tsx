import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PictureFrame from "../components/PictureFrame";
import axios from "axios";

const serverURL = process.env.REACT_APP_SERVER_URL;
declare var cv: any;
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

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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

  // useEffect(() => {
  //   let selectedRect: any = null;
  //   let contours: any = null;

  //   const initCamera = async () => {
  //     try {
  //       const constraints = await getMaxResolutionConstraints();
  //       const stream = await navigator.mediaDevices.getUserMedia(constraints);
  //       if (videoRef.current) {
  //         videoRef.current.srcObject = stream;

  //         videoRef.current.onloadedmetadata = () => {
  //           if (videoRef.current && canvasRef.current) {
  //             canvasRef.current.width = videoRef.current.videoWidth;
  //             canvasRef.current.height = videoRef.current.videoHeight;
  //             startPaperDetection();
  //           }
  //         };
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   const startPaperDetection = () => {
  //     const processFrame = () => {
  //       if (videoRef.current && canvasRef.current) {
  //         const context = canvasRef.current.getContext("2d", {
  //           willReadFrequently: true,
  //         });
  //         if (context) {
  //           context.drawImage(
  //             videoRef.current,
  //             0,
  //             0,
  //             canvasRef.current.width,
  //             canvasRef.current.height
  //           );
  //           const src = cv.imread(canvasRef.current);
  //           const gray = new cv.Mat();
  //           cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  //           const histEq = new cv.Mat();
  //           cv.equalizeHist(gray, histEq);
  //           const scaled = new cv.Mat();
  //           const alpha = 3; // 대비 조절
  //           const beta = 0; // 밝기 조절
  //           cv.convertScaleAbs(gray, scaled, alpha, beta);
  //           cv.GaussianBlur(gray, gray, new cv.Size(5, 5), 0);
  //           const edges = new cv.Mat();
  //           cv.Canny(gray, edges, 100, 200);
  //           cv.imshow(canvasRef.current, gray);

  //           if (contours) {
  //             contours.delete(); // 이전의 contours가 있을 경우 삭제
  //           }

  //           contours = new cv.MatVector();
  //           const hierarchy = new cv.Mat();
  //           cv.findContours(
  //             edges,
  //             contours,
  //             hierarchy,
  //             cv.RETR_TREE,
  //             cv.CHAIN_APPROX_NONE
  //           );

  //           let largestRect = null;
  //           for (let i = 0; i < contours.size(); i++) {
  //             const contour = contours.get(i);
  //             const peri = cv.arcLength(contour, true);
  //             const approx = new cv.Mat();
  //             cv.approxPolyDP(contour, approx, 0.02 * peri, true);

  //             if (approx.rows >= 4) {
  //               const rect = cv.boundingRect(approx);
  //               if (
  //                 !selectedRect || // 선택된 사각형이 없거나,
  //                 rect.width * rect.height >
  //                   largestRect?.width * largestRect?.height ||
  //                 !largestRect ||
  //                 (selectedRect &&
  //                   rect.x === selectedRect.x &&
  //                   rect.y === selectedRect.y &&
  //                   rect.width === selectedRect.width &&
  //                   rect.height === selectedRect.height)
  //               ) {
  //                 largestRect = rect;
  //               }
  //             }
  //             approx.delete();
  //           }

  //           if (largestRect) {
  //             setIsDetected(true);
  //             const ctx = canvasRef.current.getContext("2d", {
  //               willReadFrequently: true,
  //             });
  //             if (ctx) {
  //               ctx.clearRect(
  //                 0,
  //                 0,
  //                 canvasRef.current.width,
  //                 canvasRef.current.height
  //               );
  //               ctx.strokeStyle = "#ff0000";
  //               ctx.lineWidth = 5;
  //               ctx.strokeRect(
  //                 largestRect.x,
  //                 largestRect.y,
  //                 largestRect.width,
  //                 largestRect.height
  //               );
  //               selectedRect = largestRect;
  //             }
  //           } else {
  //             setIsDetected(false);
  //             selectedRect = null;
  //           }

  //           // Memory cleanup
  //           src.delete();
  //           gray.delete();
  //           edges.delete();
  //           hierarchy.delete();
  //           histEq.delete();
  //           scaled.delete();
  //         }
  //       }
  //     };

  //     const handleClick = (e: MouseEvent) => {
  //       if (canvasRef.current && contours) {
  //         console.log(1);
  //         const rect = canvasRef.current.getBoundingClientRect();
  //         const x = e.clientX - rect.left;
  //         const y = e.clientY - rect.top;

  //         let closestContour = null;
  //         let minDistance = Infinity;

  //         for (let i = 0; i < contours.size(); i++) {
  //           const contour = contours.get(i);
  //           const moments = cv.moments(contour, false);
  //           const cx = moments.m10 / moments.m00; // 중심의 x 좌표
  //           const cy = moments.m01 / moments.m00; // 중심의 y 좌표

  //           const distance = Math.sqrt(
  //             Math.pow(cx - x, 2) + Math.pow(cy - y, 2)
  //           );
  //           if (distance < minDistance) {
  //             minDistance = distance;
  //             closestContour = contour;
  //           }
  //         }

  //         if (closestContour) {
  //           const peri = cv.arcLength(closestContour, true);
  //           const approx = new cv.Mat();
  //           cv.approxPolyDP(closestContour, approx, 0.02 * peri, true);

  //           if (approx.rows >= 4) {
  //             selectedRect = cv.boundingRect(approx);
  //           }

  //           approx.delete();
  //         }
  //       }
  //     };

  //     if (canvasRef.current) {
  //       canvasRef.current.addEventListener("click", handleClick);
  //     }

  //     const intervalId = setInterval(processFrame, 1000); // 1000ms = 1초

  //     return () => {
  //       clearInterval(intervalId);
  //       if (canvasRef.current) {
  //         canvasRef.current.removeEventListener("click", handleClick);
  //       }
  //       contours?.delete(); // Clean up contours here
  //     };
  //   };

  //   initCamera();

  //   return () => {
  //     stopCamera();
  //   };
  // }, []);

  useEffect(() => {
    let selectedRect: any = null;
    const initCamera = async () => {
      try {
        const constraints = await getMaxResolutionConstraints();
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current && canvasRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
              // startPaperDetection();
            }
          };
        }
      } catch (error) {
        console.error(error);
      }
    };

    const startPaperDetection = () => {
      const processFrame = () => {
        if (videoRef.current && canvasRef.current) {
          const context = canvasRef.current.getContext("2d", {
            willReadFrequently: true,
          });
          if (context) {
            context.drawImage(
              videoRef.current,
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );
            const src = cv.imread(canvasRef.current);
            const graySrc = new cv.Mat();
            cv.cvtColor(src, graySrc, cv.COLOR_RGBA2GRAY);
            const binarySrc = new cv.Mat();
            cv.threshold(graySrc, binarySrc, 0.0, 255.0, cv.THRESH_OTSU);

            const contours = new cv.MatVector();
            const hierarchy = new cv.Mat();
            cv.findContours(
              binarySrc,
              contours,
              hierarchy,
              cv.RETR_TREE,
              cv.CHAIN_APPROX_SIMPLE
            );

            let largestRect = null;
            let largestArea = 0.0;
            for (let i = 0; i < contours.size(); i++) {
              const contour = contours.get(i);
              const area = cv.contourArea(contour);
              const peri = cv.arcLength(contour, true);
              const approx = new cv.Mat();
              cv.approxPolyDP(contour, approx, 0.02 * peri, true);
              if (approx.rows >= 4) {
                const rect = cv.boundingRect(approx);
                if (area > largestArea) {
                  largestArea = area;
                  largestRect = rect;
                }
                approx.delete();
              }
            }

            if (largestRect && largestArea >= 300) {
              setIsDetected(true);
              const ctx = canvasRef.current.getContext("2d", {
                willReadFrequently: true,
              });
              if (ctx) {
                ctx.clearRect(
                  0,
                  0,
                  canvasRef.current.width,
                  canvasRef.current.height
                );
                ctx.strokeStyle = "#ff0000";
                ctx.lineWidth = 5;
                ctx.strokeRect(
                  largestRect.x,
                  largestRect.y,
                  largestRect.width,
                  largestRect.height
                );
                selectedRect = largestRect;
              }
            } else {
              setIsDetected(false);
              selectedRect = null;
            }

            // Memory cleanup
            src.delete();
            graySrc.delete();
            binarySrc.delete();
            contours.delete();
            hierarchy.delete();
          }
        }
      };

      const handleClick = (e: MouseEvent) => {
        if (canvasRef.current) {
          const rect = canvasRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          if (selectedRect) {
            // 클릭한 위치가 현재 선택된 사각형 내부인지 확인
            if (
              x >= selectedRect.x &&
              x <= selectedRect.x + selectedRect.width &&
              y >= selectedRect.y &&
              y <= selectedRect.y + selectedRect.height
            ) {
              return; // 이미 선택된 사각형이면 아무것도 하지 않음
            }
          }

          // 새로 선택한 사각형 찾기
          selectedRect = null;
        }
      };

      if (canvasRef.current) {
        canvasRef.current.addEventListener("click", handleClick);
      }
      const intervalId = setInterval(processFrame, 200); // 1000ms = 1초

      return () => {
        clearInterval(intervalId);
        if (canvasRef.current) {
          canvasRef.current.removeEventListener("click", handleClick);
        }
      }; // 컴포넌트 언마운트 시 interval 정리
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

        const imgUrl = canvasRef.current.toDataURL();
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
        <StyledCanvas ref={canvasRef} />
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
            console.log("pictureList=", pictureList);
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
