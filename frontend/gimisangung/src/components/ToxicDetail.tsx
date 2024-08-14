import { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import Carousel from "react-material-ui-carousel";
import ToxicDescription from "./ToxicDescription";
import { ContractDetailType } from "../pages/Result";

interface ToxicDetailProps {
  contractDetail: ContractDetailType;
  selectedToxic: number | null;
  setSelectedToxic: React.Dispatch<React.SetStateAction<number | null>>;
  showCarousel: string;
  setShowCarousel: React.Dispatch<React.SetStateAction<string>>;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CarouselContainerProps {
  $clicked: boolean;
}

const ImgContainer = styled.div`
  overflow: visible;
  margin-top: 1rem;
  height: 100%;
  flex-grow: 1;
`;
const StyledCanvas = styled.canvas`
  width: 100%;
`;
const CarouselContainer = styled.div<CarouselContainerProps>`
  position: sticky;
  bottom: 1rem;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`;

const StyledCarousel = styled(Carousel)`
  border-radius: 1rem;
  padding: 0.3rem;
`;

let buttons: Path2D[][] = [];
let context: CanvasRenderingContext2D | null;
let images: HTMLImageElement[];

let scrollNum = 0;

const ToxicDetail = ({
  contractDetail,
  selectedToxic,
  setSelectedToxic,
  showCarousel,
  setShowCarousel,
  setChecked,
}: ToxicDetailProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [carouselClicked, setCarouselClicked] = useState(false);

  useEffect(() => {
    const initCanvas = async () => {
      buttons = [];
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
                currentHeight,
                canvasRef.current.width,
                canvasRef.current.height
              );
            }
            contractDetail.clauses.forEach((poison, idx) => {
              const tempArray: Path2D[] = [];
              poison.boxes.forEach((box) => {
                if (box.page === i + 1 && context) {
                  if (selectedToxic === null) {
                    // 선택된 조항이 없으면 전부 빨간색
                    context.fillStyle = "rgba(255, 0, 0, 0.5)";
                  } else {
                    context.fillStyle = "rgba(255, 255, 255, 0.5)";
                    if (idx === selectedToxic) {
                      // 선택된 조항만 빨간색
                      context.fillStyle = "rgba(255, 0, 0, 0.5)";
                      scrollNum = i * imgHeight;
                      const CarouselRef =
                        document.getElementById("StyledCarousel");
                      if (canvasRef.current && CarouselRef) {
                        scrollNum = scrollNum + canvasRef.current.offsetTop;
                      }
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
              if (tempArray.length !== 0) {
                buttons.push(tempArray);
              }
            });
            currentHeight += imgHeight;
          });
        }
      }
      const SubConainer = document.getElementById("SubContainer");
      if (SubConainer && canvasRef.current) {
        SubConainer.scroll({
          top: scrollNum,
          behavior: "smooth",
        });
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
          setSelectedToxic((prev) => {
            const newValue = prev === i ? null : i;
            return newValue;
          });
          setShowCarousel("block");
          break outerloop;
        }
      }
    }
  };

  return (
    <ImgContainer className="ImgContainer">
      <StyledCanvas id="myCanvas" ref={canvasRef} onClick={canvasClicked} />
      <CarouselContainer
        id="StyledCarousel"
        style={{ display: showCarousel }}
        onClick={() => {
          setCarouselClicked((prev) => !prev);
        }}
        $clicked={carouselClicked}
      >
        <StyledCarousel
          index={selectedToxic ?? 0}
          autoPlay={false}
          swipe={true}
          animation="slide"
          indicators={false}
          onChange={(newIndex) => {
            if (newIndex !== undefined) {
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
              setChecked={setChecked}
            />
          ))}
        </StyledCarousel>
      </CarouselContainer>
    </ImgContainer>
  );
};

export default ToxicDetail;
