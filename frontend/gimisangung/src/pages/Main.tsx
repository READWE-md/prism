import { Card, Stack, Box, Typography } from "@mui/material";
import _ContractCard from "../components/_ContractCard";
import Divider from "@mui/material/Divider";

/**
 * [npm install react-calendar]
 * https://github.com/wojtekmaj/react-calendar
 */
import Calendar from "react-calendar";
import "../style/Calendar.css";

import ProfileImageSrc from "../assets/profile_image_sample.jpg";
import styled from "styled-components";
import React, { useState } from "react";
import BottomNavigationBar from "../components/BottomNavigationBar";
import ContractListItem from "../components/ContractListItem";

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
  padding: "0 0 70px 0",
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
  return (
    <StyledBox>
      <Stack spacing={1.5} justifyContent="center" alignItems="center">
        <Stack
          spacing={1}
          sx={{ width: "85vw", paddingTop: "20px", fontSize: "17px" }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <ProfileImage src={ProfileImageSrc} />
          <div>
            <Username>팀쿡</Username>
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
              formatDay={(locale, date) => `${date.getDate()}`}
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
          <ContractListItem
            contract={{
              id: 1,
              status: "DONE",
              name: "aaa",
              created_at: "2024.08.13",
              tags: ["aaa", "bbb", "ccc", "ddd"],
            }}
          />
          <ContractListItem
            contract={{
              id: 1,
              status: "DONE",
              name: "aaa",
              created_at: "2024.08.13",
              tags: ["aaa", "bbb", "ccc", "ddd"],
            }}
          />

          <ContractListItem
            contract={{
              id: 1,
              status: "DONE",
              name: "aaa",
              created_at: "2024.08.13",
              tags: ["aaa", "bbb", "ccc", "ddd"],
            }}
          />

          <ContractListItem
            contract={{
              id: 1,
              status: "DONE",
              name: "aaa",
              created_at: "2024.08.13",
              tags: ["aaa", "bbb", "ccc", "ddd"],
            }}
          />
        </Stack>
      </Stack>
      <BottomNavigationBar />
    </StyledBox>
  );
};

export default Main;