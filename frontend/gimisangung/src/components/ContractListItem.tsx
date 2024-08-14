import styled from "styled-components";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../reducer";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { save } from "../reducer/account";
import { Card, Stack, Box, Typography } from "@mui/material";
import HeightIcon from "@mui/icons-material/Height";
import Checkbox from "@mui/material/Checkbox";
const serverURL = process.env.REACT_APP_SERVER_URL;

interface Contract {
  id: number;
  status: string;
  name: string;
  viewedAt: string;
  startDate: string | null;
  expireDate: string | null;
  tags: string[];
  parentId: number;
}

interface ContractListItemProps {
  contract: Contract;
  selectedContracts?: Contract[];
  drawerOpen?: boolean;
  clickContract?: (contract: Contract) => void;
  handleTouchContractStart?: (contract: Contract) => void;
  handleTouchEnd?: () => void;
  contractStatus?: (contract: Contract) => string;
}

const ListItem = styled.div`
  background-color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  height: auto;
  width: 100%;
  min-height: 4.5rem;
`;

const ListContentWrapper = styled.div`
  width: 100%;
`;

const StyledH4 = styled.span`
  margin: 0;
  margin-top: 0.1rem;
  font-size: large;
  font-weight: bold;
  display: block;
`;
const StyledSpan = styled.span`
  margin: 0;
  font-size: 12px;
`;

const StyledCreatedAt = styled.p`
  margin: 0;
  font-size: 11px;
  white-space: nowrap;
`;

const TagWrapper = styled.div`
  margin: 0.3rem 0.1rem;
  display: flex;
  flex-wrap: wrap;
`;

const Tag = styled.div`
  font-size: 12px;
  margin-left: 0.4rem;
  color: white;
  border-radius: 15px;
  padding: 0.2rem 0.4rem;
  margin-top: 0.3rem;
`;

const ContractorWrapper = styled.div`
  display: flex;
  justify-content: center;
  border-top: 1px solid #b8b8b8;
`;

const Contractor = styled.div`
  text-align: center;
  width: 50%;
`;

const ContractSubWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ContractListItem = ({
  contract,
  selectedContracts,
  drawerOpen,
  clickContract,
  handleTouchContractStart,
  handleTouchEnd,
  contractStatus,
}: ContractListItemProps) => {
  const navigate = useNavigate();
  const colors = ["#1769AA", "#A31545", "#B2A429", "#008a05", "#34008e"];
  const { userId, username, email } = useSelector(
    (state: RootState) => state.account
  );
  let temp: number[];
  if (contract.parentId) {
    temp = [contract.parentId];
  }

  const dispatch = useDispatch();
  const fetchDirectoryPath = async () => {
    let i = 0;
    const tempDirPath = temp;
    const tempDirPathName = [];
    while (i < 20) {
      try {
        let res = await axios({
          method: "get",
          url: `${serverURL}/api/v1/directories/${tempDirPath[0]}`,
        });

        if (res.data.parentId === null) {
          tempDirPathName.unshift("홈");
          break;
        } else {
          tempDirPathName.unshift(res.data.name);
          tempDirPath.unshift(res.data.parentId);
        }
      } catch (err) {
        console.log(err);
        break;
      }

      i++;
    }
    dispatch(save(username, tempDirPath, tempDirPathName, email, userId));
  };
  const goDirectory = async () => {
    await fetchDirectoryPath();
    navigate("/home");
  };
  return (
    <Card
      sx={{ padding: "10px", margin: "0", width: "100%", borderRadius: "10px" }}
      key={contract.id}
      onClick={() => {
        clickContract ? clickContract(contract) : goDirectory();
      }}
      onTouchStart={() =>
        handleTouchContractStart ? handleTouchContractStart(contract) : null
      }
      onTouchEnd={() => (handleTouchEnd ? handleTouchEnd() : null)}
      style={{
        backgroundColor: selectedContracts
          ? selectedContracts.includes(contract)
            ? "#CFCFCF"
            : "white"
          : "white",
        opacity:
          contract.status === "DONE" || contract.status === "FAIL"
            ? "100%"
            : "50%",
        border: contract.status === "FAIL" ? "1px solid red" : "none",
      }}
    >
      <ListItem
        style={{
          backgroundColor: selectedContracts
            ? selectedContracts.includes(contract)
              ? "#CFCFCF"
              : "white"
            : "white",
          opacity:
            contract.status === "DONE" || contract.status === "FAIL"
              ? "100%"
              : "50%",
        }}
      >
        {selectedContracts ? (
          <Checkbox
            checked={selectedContracts.includes(contract)}
            style={{ display: drawerOpen ? "block" : "none" }}
          />
        ) : null}

        <ListContentWrapper>
          <StyledH4>{contract.name}</StyledH4>
          {contract.status === "DONE" ? (
            <div>
              <ContractSubWrapper>
                <StyledCreatedAt>
                  {contract.startDate || contract.expireDate
                    ? (contract.startDate
                        ? contract.startDate.slice(0, 10)
                        : "-") +
                      " ~ " +
                      (contract.expireDate
                        ? contract.expireDate.slice(0, 10)
                        : "-")
                    : null}
                </StyledCreatedAt>

                <TagWrapper>
                  {contract.tags.map((tag, idx) =>
                    idx !== 2 && idx !== 3 ? (
                      <Tag
                        key={idx}
                        style={{
                          backgroundColor: colors[idx % colors.length],
                          display: tag === "-" ? "none" : "block",
                        }}
                      >
                        {tag}
                      </Tag>
                    ) : null
                  )}
                </TagWrapper>
              </ContractSubWrapper>
              <ContractorWrapper>
                <Contractor>{contract.tags[2]}</Contractor>
                <HeightIcon style={{ transform: "rotate(90deg)" }} />
                <Contractor>{contract.tags[3]}</Contractor>
              </ContractorWrapper>
            </div>
          ) : contractStatus ? (
            <StyledSpan>{contractStatus(contract)}</StyledSpan>
          ) : null}
        </ListContentWrapper>
      </ListItem>
    </Card>
  );
};
export default ContractListItem;
