import { Card, Stack, Box, Typography } from "@mui/material";
import _ContractCard from "../components/_ContractCard";
import Divider from "@mui/material/Divider";
import axios from "axios";
import { RootState } from "../reducer";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
/**
 * [npm install react-calendar]
 * https://github.com/wojtekmaj/react-calendar
 */
import Calendar, { CalendarProps } from "react-calendar";

import "../style/Calendar.css";

import ProfileImageSrc from "../assets/profile_image_sample.jpg";
import styled from "styled-components";
import React, { useState, useEffect } from "react";
import BottomNavigationBar from "../components/BottomNavigationBar";
import ContractListItem from "../components/ContractListItem";
import CalendarDot from "../components/CalendarDot";

const Url = process.env.REACT_APP_SERVER_URL;
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
const ProfileImage = styled.img`
  border-radius: 50%;
  width: 35px;
  height: 35px;
  overflow: hidden;
  padding: 0;
  margin: 0;
  object-fit: cover;
`;

const Username = styled.span`
  font-weight: bold;
`;

const StyledBox = styled(Box)(() => ({
  color: "#606060",
  backgroundColor: "#f8f8f8",
  width: "100vw",
  margin: "0",
  display: "flex",
  justifyContent: "center",
  alignContent: "center",
}));

const MenuDivider = styled.div`
  padding: 0 15px 0 15px;
  width: 90vw;
  font-size: 12px;
  font-weight: bold;
`;

const MenuDescription = styled.div`
  margin-bottom: 5px;
  font-size: 12px;
  font-weight: bold;
`;

const Main = () => {
  const [currentDate, setCurrentDate] = useState<Date | null>(new Date());
  const [contractList, setContractList] = useState<Contract[]>([]);
  const [monthlyContractList, setMonthlyContractList] = useState<Contract[]>([]);
  const { username } = useSelector((state: RootState) => state.account);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  function getStartAndEndOfMonth() {
    const now = new Date();

    // 이번 달의 시작일 (1일)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 이번 달의 종료일 (다음 달 1일의 전날)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    console.log(startOfMonth, endOfMonth);

    return {
      startOfMonth,
      endOfMonth,
    };
  }

  const { startOfMonth, endOfMonth } = getStartAndEndOfMonth();

  const handleDateChange: CalendarProps["onChange"] = (value, event) => {
    if (Array.isArray(value)) {
      // value가 배열일 경우, 배열의 첫 번째 값을 사용하여 상태를 설정합니다.
      setCurrentDate(() => value[0]);
    } else if (value instanceof Date || value === null) {
      // value가 Date 또는 null인 경우, 바로 상태를 설정합니다.
      setCurrentDate(() => value);
    }
  };
  useEffect(() => {
    // setContractList([
    //   {
    //     id: 1,
    //     status: "done",
    //     name: "asdasdasd",
    //     viewedAt: "1374490205",
    //     startDate: "1374490205",
    //     expireDate: "1374490205",
    //     tags: ["태그a", "태그b", "태그c"],
    //     parentId: 123,
    //   },
    // ]);
    if (!isLoading || currentDate === null) {
      setIsLoading(() => true);
      return;
    }
    axios({
      method: "get",
      url: `${Url}/api/v1/contracts`,
      params: {
        startDate: currentDate.toISOString().slice(0, 19),
        endDate: currentDate.toISOString().slice(0, 19),
      },
    })
      .then((res) => {
        setContractList(res.data.contracts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentDate]);

  useEffect(() => {
    // setContractList([
    //   {
    //     id: 1,
    //     status: "done",
    //     name: "asdasdasd",
    //     viewedAt: "1374490205",
    //     startDate: "1374490205",
    //     expireDate: "1374490205",
    //     tags: ["태그a", "태그b", "태그c"],
    //     parentId: 123,
    //   },
    // ]);
    axios({
      method: "get",
      url: `${Url}/api/v1/contracts`,
      params: {
        startDate: startOfMonth.toISOString().slice(0, 19),
        endDate: endOfMonth.toISOString().slice(0, 19),
      },
    })
      .then((res) => {
        setMonthlyContractList(res.data.contracts);
        setContractList(res.data.contracts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <StyledBox>
      <Stack
        sx={{ margin: "0 0 10vh 0" }}
        spacing={1.5}
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          spacing={1}
          sx={{ width: "85vw", paddingTop: "20px", fontSize: "17px" }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          {/* <ProfileImage src={ProfileImageSrc} /> */}
          <div>
            <Username>{username}</Username>
            <span>님! 안녕하세요!</span>
          </div>
        </Stack>
        <MenuDivider>
          <MenuDescription>&nbsp;계약 캘린더</MenuDescription>
          <Divider />
        </MenuDivider>
        <Stack
          spacing={1.5}
          direction="column"
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ width: "85vw" }}
        >
          <Card sx={{ width: "100%", padding: "10px", borderRadius: "10px" }}>
            <Calendar
              calendarType="gregory"
              locale="ko-KO"
              defaultView="month"
              minDetail="month"
              maxDetail="month"
              showNeighboringMonth={false} //  이전, 이후 달의 날짜는 보이지 않도록 설정
              formatDay={(locale, date) => `${date.getDate()}`}
              onChange={handleDateChange}
              tileContent={({ date, view }) => {
                if (
                  monthlyContractList.find(
                    (contract) =>
                      moment(contract.expireDate).format("YYYY-MM-DD") ===
                      moment(date).format("YYYY-MM-DD") &&
                      moment(contract.startDate).format("YYYY-MM-DD") ===
                      moment(date).format("YYYY-MM-DD")
                  )
                ) {
                  return (
                    <>
                      <Stack
                        spacing={0.3}
                        direction="row"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <CalendarDot dotType="end" />
                        <CalendarDot dotType="start" />
                      </Stack>
                    </>
                  );
                }
                if (
                  monthlyContractList.find(
                    (contract) =>
                      moment(contract.expireDate).format("YYYY-MM-DD") ===
                      moment(date).format("YYYY-MM-DD")
                  )
                ) {
                  return (
                    <>
                      <Stack
                        spacing={0.3}
                        direction="row"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <CalendarDot dotType="end" />
                      </Stack>
                    </>
                  );
                }
                if (
                  monthlyContractList.find(
                    (contract) =>
                      moment(contract.startDate).format("YYYY-MM-DD") ===
                      moment(date).format("YYYY-MM-DD")
                  )
                ) {
                  return (
                    <>
                      <Stack
                        spacing={0.3}
                        direction="row"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <CalendarDot dotType="start" />
                      </Stack>
                    </>
                  );
                }
              }}
            ></Calendar>
          </Card>
        </Stack>
        <MenuDivider>
          <MenuDescription>&nbsp;진행 중인 계약서</MenuDescription>
          <Divider />
        </MenuDivider>
        <Stack
          spacing={1.5}
          sx={{ width: "85vw" }}
          direction="column"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {contractList.map((contract) => (
            <ContractListItem key={contract.id} contract={contract} />
          ))}
        </Stack>
      </Stack>

      <BottomNavigationBar />
    </StyledBox>
  );
};

export default Main;
