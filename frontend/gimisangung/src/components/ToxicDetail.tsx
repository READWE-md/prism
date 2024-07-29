import { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import Carousel from "react-material-ui-carousel";
import { Button } from "@mui/material";
import ToxicDescription from "./ToxicDescription";
import { useNavigate } from "react-router-dom";
import { ContractDetailType } from "../pages/Result";

interface ToxicDetailProps {
  contractDetail: ContractDetailType;
  imgUrl: string[];
}

const ImgContainer = styled.div`
  overflow-y: auto;
  height: 80vh;
  display: relative;
`;

const StyledCanvas = styled.canvas`
  width: 100%;
`;

const CarouselContainer = styled.div`
  position: absolute;
  bottom: 15%;
  left: 0;
  width: 100%;
`;

let buttons: Path2D[] = [];
let context: CanvasRenderingContext2D | null;
let images: HTMLImageElement[];

const ToxicDetail = ({ contractDetail, imgUrl }: ToxicDetailProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedToxic, setSelectedToxic] = useState<number | null>(null);
  const [showCarousel, setShowCarousel] = useState("none");
  const navigate = useNavigate();

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
                  img.src = src.url;
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
              context.fillStyle = "rgba(82, 82, 82, 0.8)";
              // context.globalCompositeOperation = "color";
              context.fillRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
              );
            }
            contractDetail.clauses.forEach((poison, idx) => {
              poison.boxes.forEach((box) => {
                if (box.page === i + 1 && context) {
                  if (selectedToxic === null) {
                    context.fillStyle = "rgba(255, 0, 0, 0.3)";
                  } else {
                    context.fillStyle = "rgba(255, 255, 255, 0.5)";
                    if (idx === selectedToxic) {
                      context.fillStyle = "rgba(255, 0, 0, 0.3)";
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
                  buttons.push(path);
                }
              });
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

    let changed = false;
    for (let a = 0; a < buttons.length; a++) {
      if (context?.isPointInPath(buttons[a], calX, calY)) {
        setSelectedToxic((prev) => (prev === a ? null : a));
        setShowCarousel("block");
        changed = true;
        break;
      }
    }
    if (changed === false) {
      setSelectedToxic(null);
      setShowCarousel("none");
    }
  };

  return (
    <>
      <ImgContainer>
        <StyledCanvas id="myCanvas" ref={canvasRef} onClick={canvasClicked} />
        <CarouselContainer style={{ display: showCarousel }}>
          <Carousel
            index={selectedToxic ?? 0}
            autoPlay={false}
            animation="slide"
            indicators={false}
          >
            {contractDetail.clauses.map((e, idx) => (
              <ToxicDescription
                danger="danger"
                title={e.content}
                text={e.result}
                key={idx}
              />
            ))}
          </Carousel>
        </CarouselContainer>
      </ImgContainer>
      <Button onClick={() => navigate("/")} variant="outlined">
        다 확인 했어요
      </Button>
    </>
  );
};

export default ToxicDetail;
