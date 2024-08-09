import { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import Carousel from "react-material-ui-carousel";
import ToxicDescription from "./ToxicDescription";
import { useNavigate } from "react-router-dom";
import { ContractDetailType } from "../pages/Result";

interface ToxicDetailProps {
  contractDetail: ContractDetailType;
  selectedToxic: number | null;
  setSelectedToxic: React.Dispatch<React.SetStateAction<number | null>>;
  showCarousel: string;
  setShowCarousel: React.Dispatch<React.SetStateAction<string>>;
}

const ImgContainer = styled.div`
  overflow-y: auto;
  position: relative;
  margin-top: 1rem;
  height: 100%;
  /* background-color: blue; */
  flex-grow: 1;
`;
const StyledCanvas = styled.canvas`
  width: 100%;
`;
const CarouselContainer = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 0;
  width: 100%;
`;

const StyledCarousel = styled(Carousel)`
  border-radius: 1rem;
  padding: 0.3rem;
`;

let buttons: Path2D[][] = [];
let context: CanvasRenderingContext2D | null;
let images: HTMLImageElement[];

// const getRandomColor = () => {
//   return (
//     "rgba(" +
//     Math.floor(Math.random() * 255) +
//     "," +
//     Math.floor(Math.random() * 255) +
//     "," +
//     Math.floor(Math.random() * 255) +
//     ",0.3)"
//   );
// };

const ToxicDetail = ({
  contractDetail,
  selectedToxic,
  setSelectedToxic,
  showCarousel,
  setShowCarousel,
}: ToxicDetailProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // const [selectedToxic, setSelectedToxic] = useState<number | null>(null);
  // const [showCarousel, setShowCarousel] = useState("none");

  // const navigate = useNavigate();

  // const [colors, setColors] = useState<string[]>([]);
  // const generateColors = (n: number) => {
  //   const newColors = [];
  //   for (let i = 0; i < n; i++) {
  //     newColors.push(getRandomColor());
  //     setColors(newColors);
  //   }
  // };

  useEffect(() => {
    const initCanvas = async () => {
      if (canvasRef.current) {
        context = canvasRef.current.getContext("2d");
        if (context) {
          let totalHeight = 0;
          images = await Promise.all(
            contractDetail.images.map(
              (src) =>
                new Promise<HTMLImageElement>((resolve) => {
                  const img = new Image();
                  img.src = src.base64;
                  img.onload = () => resolve(img);
                })
            )
          );

          totalHeight = images.reduce((acc, img) => acc + img.height, 0);
          canvasRef.current.height = totalHeight;
          canvasRef.current.width = images[0].width;

          let currentHeight = 0;
          images.forEach((image, i) => {
            const imgHeight = image.height;
            const imgWidth = image.width;

            context?.drawImage(image, 0, currentHeight, imgWidth, imgHeight);
            if (context && selectedToxic !== null && canvasRef.current) {
              context.fillStyle = "rgba(82, 82, 82, 0.7)";
              context.fillRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
              );
            }
            contractDetail.clauses.forEach((poison, idx) => {
              const tempArray: Path2D[] = [];
              poison.boxes.forEach((box) => {
                if (box.page === i + 1 && context) {
                  if (selectedToxic === null) {
                    // context.fillStyle = colors[idx];
                    context.fillStyle = "rgba(255, 0, 0, 0.5)";
                  } else {
                    context.fillStyle = "rgba(255, 255, 255, 0.5)";
                    if (idx === selectedToxic) {
                      context.fillStyle = "rgba(255, 0, 0, 0.5)";
                      // context.fillStyle = colors[idx];
                    }
                  }
                  context.fillRect(
                    box.ltx,
                    currentHeight + box.lty,
                    box.rbx - box.ltx,
                    box.rby - box.lty
                  );

                  const path = new Path2D();
                  path.rect(
                    box.ltx,
                    currentHeight + box.lty,
                    box.rbx - box.ltx,
                    box.rby - box.lty
                  );
                  tempArray.push(path);
                }
              });
              buttons.push(tempArray);
            });
            currentHeight += imgHeight;
          });
        }
      }
    };

    initCanvas();
  }, [contractDetail, selectedToxic]);

  const canvasClicked = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    let calX = 0;
    let calY = 0;
    if (canvasRef.current) {
      calX = offsetX * (images[0].width / canvasRef.current.offsetWidth);
      calY = offsetY * (images[0].width / canvasRef.current.offsetWidth);
    }

    outerloop: for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      for (let j = 0; j < button.length; j++) {
        const path = button[j];
        setShowCarousel("none");
        setSelectedToxic(null);
        if (context?.isPointInPath(path, calX, calY)) {
          setSelectedToxic((prev) => (prev === i ? null : i));
          setShowCarousel("block");
          break outerloop;
        }
      }
    }
  };

  return (
    <ImgContainer className="ImgContainer">
      <StyledCanvas id="myCanvas" ref={canvasRef} onClick={canvasClicked} />
      <CarouselContainer style={{ display: showCarousel }}>
        <StyledCarousel
          index={selectedToxic ?? 0}
          autoPlay={false}
          swipe={true}
          animation="slide"
          indicators={false}
          onChange={(newIndex) => {
            if (newIndex) {
              setSelectedToxic(newIndex);
            }
          }}
          navButtonsAlwaysInvisible={true}
        >
          {contractDetail.clauses.map((e, idx) => (
            <ToxicDescription
              danger={e.type}
              title={e.content}
              text={e.result}
              key={idx}
            />
          ))}
        </StyledCarousel>
        {/* <BtnContainer>
            <PrevBtn
              onClick={() => {
                setSelectedToxic((prev) => prev! - 1);
              }}
              style={{
                visibility: selectedToxic! > 0 ? "visible" : "hidden",
              }}
            >
              이전
            </PrevBtn>
            <NextBtn
              onClick={() => {
                setSelectedToxic((prev) => prev! + 1);
              }}
              style={{
                visibility:
                  selectedToxic! < contractDetail.clauses.length - 1
                    ? "visible"
                    : "hidden",
              }}
            >
              다음
            </NextBtn>
          </BtnContainer> */}
      </CarouselContainer>
    </ImgContainer>
  );
};

export default ToxicDetail;
