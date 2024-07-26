import { useRef, useEffect } from "react";
import styled from "styled-components";

interface ContractDetailType {
  statusCode: number;
  id: number;
  summary: string;
  filepath: string;
  poisons: Array<{
    content: string;
    boxes: Array<{
      ltx: number;
      lty: number;
      rbx: number;
      rby: number;
    }>;
    result: string;
    confidence_score: number;
  }>;
}

interface ToxicDetailProps {
  contractDetail: ContractDetailType;
  imgUrl: string[];
}

const ImgContainer = styled.div`
  overflow-y: auto;
  height: 80vh;
`;

const StyledCanvas = styled.canvas`
  width: 100%;
`;

const ToxicDetail = ({ contractDetail, imgUrl }: ToxicDetailProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const initCanvas = async () => {
      if (canvasRef.current) {
        const context = canvasRef.current.getContext("2d");
        if (context) {
          let totalHeight = 0;
          const images = await Promise.all(
            imgUrl.map(
              (src) =>
                new Promise<HTMLImageElement>((resolve) => {
                  const img = new Image();
                  img.src = src;
                  img.onload = () => resolve(img);
                })
            )
          );

          totalHeight = images.reduce((acc, img) => acc + img.height, 0);
          canvasRef.current.height = totalHeight;
          canvasRef.current.width = images[0].width;

          let currentHeight = 0;
          for (let i = 0; i < images.length; i++) {
            context.drawImage(
              images[i],
              0,
              currentHeight,
              images[i].width,
              images[i].height
            );

            // Draw rectangles for this image
            contractDetail.poisons.forEach((poison) => {
              poison.boxes.forEach((box) => {
                context.strokeStyle = "red";
                context.lineWidth = 2;
                context.strokeRect(
                  box.ltx,
                  currentHeight + box.lty,
                  box.rbx - box.ltx,
                  box.rby - box.lty
                );
              });
            });

            currentHeight += images[i].height;
          }
        }
      }
    };

    initCanvas();
  }, [imgUrl, contractDetail]);

  return (
    <ImgContainer>
      <StyledCanvas id="myCanvas" ref={canvasRef} />
    </ImgContainer>
  );
};

export default ToxicDetail;
