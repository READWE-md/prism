import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import PrimaryBtn from "../components/PrimaryBtn";
import Navbar from "./NavBar";
import blankbox from "../assets/blankbox.png";
import docu from "../assets/document.png";
import PlusBtn from "../components/PlusBtn";

interface Contract {
  id: string;
  title: string;
  file_path: string;
  created_at: string;
}

const StyledScreen = styled.div`
  background-color: #f8f8f8;
  height: 100vh;
  padding: 1rem;
`;

const BlankWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MenuBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const StyledP = styled.p`
  margin: 3rem 0;
`;

const ListItem = styled.div`
  background-color: white;
  padding: 1px 6px;
  margin-bottom: 1rem;
  border-radius: 20px;
`;

const DirectoryPath = styled.div`
  font-weight: bold;
  text-decoration: underline;
  text-underline-offset: 0.2rem;
`;

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [contractList, setContractList] = useState<Contract[]>([]);

  const addContract = () => {
    navigate("/camera");
  };

  const goResult = () => {
    navigate("/result", {
      state: {
        data: {
          contractId: 314848454,
          filepath: "http://naver.com",
          poisons: [
            {
              content:
                "제2조 (업무범위) 4. 'A'의 관리, 'A'의 관계사, 자회사 기타 투자 등 동 법인의 관리 및 동일한 업무를 상호 협의하여 부여할 수 있으며, 동 업무의 수행에 수반되어지는 각종 권리 의무는 본 계약의 규정을 준용토록 한다.",
              result:
                "이 조항은 근로자의 업무 범위를 매우 광범위하게 설정하고 있어, 근로자가 예상치 못한 과도한 업무를 부여받을 위험이 있습니다. 이는 근로자의 업무 부담을 크게 증가시킬 수 있으며, 명확한 업무 범위를 설정하지 않아 분쟁의 소지가 될 수 있습니다.",
              boxes: [
                {
                  ltx: 103,
                  lty: 463,
                  rbx: 882,
                  rby: 560,
                  page: 1,
                },
              ],
              confidence_score: 0.8,
            },
            {
              content:
                "제3조 (직위와 보수) 2. 나. 인센티브 임금 원정 (￥_______)",
              result:
                "인센티브 임금이 명확하게 기재되어 있지 않고, '상호 협의하여 조정될' 수 있다는 표현은 회사 측이 일방적으로 인센티브를 결정할 여지를 남겨두고 있습니다. 이는 근로자의 보수 안정성을 해칠 수 있는 독소 조항입니다.",
              boxes: [
                {
                  ltx: 153,
                  lty: 983,
                  rbx: 884,
                  rby: 1232,
                  page: 1,
                },
              ],
              confidence_score: 0.8,
            },
            {
              content:
                "제3조 (직위와 보수) 4. 전항의 각 약정보수의 지급은 다음 각호의 절차에 따라 지급키로 한다. 가. 연봉은 연봉의 1/12 (제수수 포함)를 매월 일괄 지급 나. 인센티브는 연1회 고과평가 완료 후, 30일 이내 지급",
              result:
                "연봉 지급 방식과 인센티브 지급 시기가 불명확하여, 근로자는 실제로 언제, 어떻게 보수를 받을 수 있는지 명확하지 않습니다. 이는 근로자의 생활 안정에 부정적인 영향을 미칠 수 있습니다.",
              boxes: [
                {
                  ltx: 155,
                  lty: 1111,
                  rbx: 675,
                  rby: 1184,
                  page: 1,
                },
              ],
              confidence_score: 0.8,
            },
            {
              content:
                "제3조 (직위와 보수) 5. 'A'는 'B'의 업무효율 등을 위하여 교통수단 등을 제공할 수 있으며, 동 교통수단의 이용 등에 대하여는 'A'의 내부 관계규정에 따로 상세히 규정하고, 이용토록 하여야 한다.",
              result:
                "교통수단 제공에 대한 구체적인 조건이 명시되지 않아, 근로자가 자비로 교통수단을 마련해야 할 가능성이 있습니다. 이는 근로자의 경제적 부담을 증가시킬 수 있는 독소 조항입니다.",
              boxes: [
                {
                  ltx: 155,
                  lty: 1229,
                  rbx: 883,
                  rby: 1278,
                  page: 1,
                },
              ],
              confidence_score: 0.8,
            },
          ],
        },
      },
    });
  };

  useEffect(() => {
    const initialContracts: Contract[] = [
      {
        id: "1",
        title: "임원에 대한 근로계약서",
        file_path: "link/to/your/file.pdf",
        created_at: "20240201",
      },
      {
        id: "2",
        title: "임원 근로계약서",
        file_path: "link/to/your/file.pdf",
        created_at: "20240205",
      },
    ];
    setContractList(initialContracts);
  }, []);

  return (
    <StyledScreen>
      <Navbar />
      <br />
      <h3>
        <img src={docu} alt="document" style={{ marginRight: "1vw" }} />
        계약서 목록
      </h3>
      <p>
        <span style={{ fontWeight: "bold" }}>김싸피</span>님! 안녕하세요!
      </p>
      <MenuBar>
        <DirectoryPath>
          <span>하도급</span> &gt; <span>근로</span>
        </DirectoryPath>
        <PlusBtn />
      </MenuBar>
      {contractList.length > 0 ? (
        contractList.map((contract) => (
          <ListItem key={contract.id} onClick={goResult}>
            <h4>{contract.title}</h4>
          </ListItem>
        ))
      ) : (
        <BlankWrapper>
          <StyledP>계약서 목록이 비었어요!</StyledP>
          <img src={blankbox} alt="image" />
          <StyledP>계약서 추가 후 분석 결과를 받아보세요!</StyledP>
          <PrimaryBtn text="계약서 추가하기" onclick={addContract} />
        </BlankWrapper>
      )}
    </StyledScreen>
  );
};

export default Landing;
