import styled from "styled-components";

interface ContractSummaryProps {
  curr: string | undefined;
}

const ContentContainer = styled.div`
  border-bottom: 1px dotted black;
  padding: 10px;
  margin-bottom: 10px;
`;

const ContractSummary = ({ curr }: ContractSummaryProps) => {
  return (
    <ContentContainer>
      <h3>계약서 요약</h3>
      <p>{curr}</p>
    </ContentContainer>
  );
};

export default ContractSummary;
