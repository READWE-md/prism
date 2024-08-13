import styled from "styled-components";
import trafficLightImage from "../assets/traffic-light.png";
import { ContractDetailType } from "../pages/Result";

const Container = styled.div`
  width: 100%;
  position: relative;
  margin: 3rem 0;
  img {
    width: 90%;
    display: block;
    margin: 0 auto;
  }
  .count {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    text-align: center;
    color: white;
    font-weight: 500;
    font-size: 2rem;
  }
`;

const TrafficLight = ({
  contractDetail,
}: {
  contractDetail: ContractDetailType;
}) => {
  let dangerCount = 0;
  let cautionCount = 0;
  let safeCount = 0;
  contractDetail.clauses.forEach((c) => {
    switch (c.type) {
      case "danger":
        dangerCount++;
        break;
      case "caution":
        cautionCount++;
        break;
      case "safe":
        safeCount++;
        break;
      default:
        break;
    }
  });
  return (
    <Container>
      <img src={trafficLightImage} alt="traffic-light-image" />
      <div className="count">
        <span className="danger">{dangerCount}건</span>
        <span className="caution">{cautionCount}건</span>
        <span className="safe">{safeCount}건</span>
      </div>
    </Container>
  );
};

export default TrafficLight;
