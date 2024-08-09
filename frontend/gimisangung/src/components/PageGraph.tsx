import styled from "styled-components";
import { ContractDetailType } from "../pages/Result";
import { BarDatum, ResponsiveBarCanvas } from "@nivo/bar";

const Container = styled.div`
  height: 10rem;
  width: 100%;
`;

interface PageStatus {
  danger: number;
  caution: number;
  safe: number;
}

const PageGraph = ({
  contractDetail,
}: {
  contractDetail: ContractDetailType;
}) => {
  const pageNum = contractDetail.images.length;
  const pageStatus: { [key: number]: PageStatus } = {};
  for (let i = 0; i < pageNum; i++) {
    pageStatus[i + 1] = { danger: 0, caution: 0, safe: 0 };
  }
  contractDetail.clauses.forEach((c) => {
    const targetPage: number[] = [];
    c.boxes.forEach((b) => {
      if (!targetPage.includes(b.page)) {
        targetPage.push(b.page);
      }
    });
    targetPage.forEach((p) => {
      if (pageStatus[p]) {
        (pageStatus[p] as any)[c.type]++;
      }
    });
  });

  // console.log(pageStatus);

  const data = [];

  for (let i = 0; i < pageNum; i++) {
    data.push({
      page: i + 1,
      danger: pageStatus[i + 1]["danger"] | 0,
      caution: pageStatus[i + 1]["caution"] | 0,
      safe: pageStatus[i + 1]["safe"] | 0,
    });
  }
  // console.log(data);

  const colors: { [key: string]: string } = {
    danger: "red",
    caution: "orange",
    safe: "green",
  };
  const BarChart = ({ data }: { data: BarDatum[] }) => (
    <ResponsiveBarCanvas
      data={data}
      keys={["danger", "caution", "safe"]}
      indexBy="page"
      layout="horizontal"
      margin={{ top: 10, right: 50, bottom: 50, left: 50 }}
      axisBottom={{
        legend: "항목 수",
        legendPosition: "middle",
        legendOffset: 36,
      }}
      axisLeft={{
        legend: "페이지",
        legendPosition: "middle",
        legendOffset: -30,
      }}
      colors={({ id }) => colors[id]}
      onClick={(e) => {}}
      isInteractive={false}
    />
  );
  return (
    <Container>
      <BarChart data={data} />
    </Container>
  );
};

export default PageGraph;
