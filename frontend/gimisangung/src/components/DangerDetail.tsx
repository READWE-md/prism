interface DangerDetailProps {
  data: {
    content: string;
    boxes: Array<{
      ltx: number;
      lty: number;
      rbx: number;
      rby: number;
    }>;
    result: string;
    confidence_score: number;
  };
}
const DangerDetail = ({ data }: DangerDetailProps) => {
  return (
    <>
      <h5>{data.result}</h5>
      <p>{data.content}</p>
    </>
  );
};

export default DangerDetail;
