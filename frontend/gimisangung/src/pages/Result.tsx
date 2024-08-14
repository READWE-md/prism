import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import Container from "@mui/material/Container";
import AccordionExpandIcon from "../components/Accordion";
import ToxicDetail from "../components/ToxicDetail";
import FilterListIcon from "@mui/icons-material/FilterList";
// import PageGraph from "../components/PageGraph";
import { ArrowBack, ScreenShare, CallEnd, Share } from "@mui/icons-material/";
import { useSelector } from "react-redux";
import { RootState } from "../reducer";
import TrafficLight from "../components/TrafficLight";
// import { Element, animateScroll, scroller } from "react-scroll";

import { Client } from "@stomp/stompjs";

interface StatusSwitchProps {
  checked: boolean;
}

const slideLeft = keyframes`
  from {
    left: 5%;
  }
  to {
    left: 54.5%;
  }
`;

const slideRight = keyframes`
  from {
    left: 54.5%;
  }
  to {
    left: 5%;
  }
`;

const ToggleContainer = styled.div`
  width: 100%;
  height: 2.5rem;
  background-color: #d9d9d9;
  display: flex;
  position: relative;
  justify-content: space-around;
  align-items: center;
  border-radius: 5px;
`;

const BasicView = styled.div`
  width: 45%;
  height: auto;
  color: #757575;
  font-weight: bold;
  z-index: 10;
`;

const MovingToggle = styled.div<StatusSwitchProps>`
  position: absolute;
  top: 10%;
  left: ${(props) => (props.checked ? "54.5%" : "5%")};
  animation: ${(props) => (props.checked ? slideLeft : slideRight)} 0.3s ease;
  border-radius: 5px;
  background-color: white;
  width: 40%;
  height: 80%;
`;

const StyledContainer = styled(Container)`
  min-height: 100%;
  text-align: center;
  padding-bottom: 2rem;
  padding-top: 1rem;
  background-color: #f8f8f8;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 0.75rem 0;
  padding: 0 1rem;
  align-items: center;
  width: 100%;
`;

interface FilterButtonProps {
  $danger: string;
  $clicked: boolean;
}

const FilterButton = styled.button<FilterButtonProps>`
  color: white;
  background-color: ${(props) => props.$danger};
  padding: 0.5rem 1.5rem;
  border-radius: 7%;
  border: 0px;
  opacity: ${(props) => (props.$clicked ? 0.5 : 1)};
`;

const ButtonContainer = styled.div`
  width: 100%;
  margin-top: 1rem;
  display: flex;
  justify-content: center;
`;

const DoneBtn = styled.button`
  background-color: #0064ff;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;
  width: 95%;
`;

export interface ContractDetailType {
  contractId: number;
  images: Array<{
    page: number;
    base64: string;
  }>;
  clauses: Array<{
    type: string;
    content: string;
    result: string;
    boxes: Array<{
      ltx: number;
      lty: number;
      rbx: number;
      rby: number;
      page: number;
    }>;
    confidence_score: number;
  }>;
}

const ResultNav = styled.div`
  width: 100%;
  height: 3rem;
  /* background-color: blue; */
  display: flex;
  margin-bottom: 0.5rem;
  align-items: center;
  justify-content: space-between;
  .endCall {
    color: red;
  }
`;

const Title = styled.div`
  font-size: 1.25rem;
  font-weight: 500;
`;

const BackBtn = styled.button`
  height: 50%;
  color: black;
  border: none;
  background-color: #f8f8f8;
`;

const TrafficContainer = styled.div`
  width: 100%;
  height: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
`;

const Light = styled.div<FilterButtonProps>`
  position: relative;
  background-color: gray;
  height: 6rem;
  width: 6rem;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  background-color: ${({ $danger }) =>
    $danger === "danger" ? "red" : $danger === "caution" ? "orange" : "green"};
  opacity: ${({ $clicked }) => ($clicked ? 0.5 : 1)};
`;

const ShareBtn = styled.button`
  border: none;
  background-color: #f8f8f8;
`;

const SummaryConatiner = styled.div`
  width: 100%;
  margin-top: 1rem;
`;

const serverUrl = process.env.REACT_APP_SERVER_URL;
const signalingServerURL = process.env.REACT_APP_SIGNALING_SERVER_URL;

enum SignalType {
  Offer = "offer",
  Answer = "answer",
  Candidate = "candidate",
}

const Result = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [filterOption, setFilterOption] = useState<null | string>(null);

  const contractDetail: ContractDetailType = state.data;

  const [checked, setChecked] = useState(false);
  const { userId } = useSelector((state: RootState) => state.account);
  // carousel control
  const [selectedToxic, setSelectedToxic] = useState<number | null>(null);
  const [showCarousel, setShowCarousel] = useState("none");

  // webRTC
  const [remoteAudioStream, setRemoteAudioStream] =
    useState<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const stompClientRef = useRef<Client | null>(null);
  const isConnectedRef = useRef<boolean>(false);
  const iceCandidatesQueue = useRef<RTCIceCandidate[]>([]);
  const [isCallStarted, setIsCallStarted] = useState(false);
  useEffect(() => {
    if (!userId) {
      return;
    }

    const client = new Client({
      brokerURL: signalingServerURL,
      debug: (str) => console.log(str),
      onConnect: () => {
        isConnectedRef.current = true;

        client.subscribe(`/topic/peer/offer/${userId}`, (message) => {
          handleSignalingMessage(JSON.parse(message.body), SignalType.Offer);
        });

        client.subscribe(`/topic/peer/iceCandidate/${userId}`, (message) => {
          handleSignalingMessage(
            JSON.parse(message.body),
            SignalType.Candidate
          );
        });
      },
      onStompError: (error) =>
        console.error("Error connecting to the signaling server:", error),
    });

    stompClientRef.current = client;
    client.activate();

    return () => {
      client.deactivate();
      isConnectedRef.current = false;
    };
  }, [isCallStarted]);

  useEffect(() => {
    if (remoteAudioStream && remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remoteAudioStream;
    }
  }, [remoteAudioStream]);

  const handleSignalingMessage = async (message: any, type: SignalType) => {
    const peerConnection = peerConnectionRef.current;
    if (!peerConnection) return;

    switch (type) {
      case SignalType.Offer:
        // Offer를 수신했을 때, 원격 설명을 설정하고 답변을 생성
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(message)
        );

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        sendMessage(answer, SignalType.Answer);

        // 큐에 있는 ICE 후보들을 처리
        iceCandidatesQueue.current.forEach((candidate) => {
          peerConnection.addIceCandidate(candidate);
        });
        iceCandidatesQueue.current = [];

        break;

      case SignalType.Candidate:
        const candidate = new RTCIceCandidate(message);
        if (peerConnection.remoteDescription) {
          await peerConnection.addIceCandidate(candidate);
        } else {
          // 원격 설명이 설정되지 않았으면 ICE 후보를 큐에 추가
          iceCandidatesQueue.current.push(candidate);
        }
        break;

      default:
        console.error("알 수 없는 시그널링 유형:", type);
    }
  };

  const sendMessage = (message: any, type: SignalType) => {
    if (isConnectedRef.current && stompClientRef.current) {
      const destination = {
        [SignalType.Offer]: `/app/peer/offer/${userId}`,
        [SignalType.Answer]: `/app/peer/answer/${userId}`,
        [SignalType.Candidate]: `/app/peer/iceCandidate/${userId}`,
      }[type];

      stompClientRef.current.publish({
        destination: destination,
        body: JSON.stringify(message),
      });
    } else {
      console.error("STOMP 클라이언트가 연결되지 않았습니다.");
    }
  };

  // 화면 공유 시작하는 함수
  // 공유 버튼 눌렀을 때 이 함수 실행하면 됨
  const startCall = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // const userAudioStream = await navigator.mediaDevices.getUserMedia({
      //   audio: true,
      //   video: true,
      // });

      // displayStream.addTrack(userAudioStream.getTracks()[0]);

      // STUN 서버 설정
      const peerConnectionConfig = {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" }, // Google STUN 서버
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          // 필요한 경우 추가 TURN 서버 등을 설정할 수 있습니다.
        ],
      };

      const peerConnection = new RTCPeerConnection(peerConnectionConfig);
      peerConnectionRef.current = peerConnection;

      displayStream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, displayStream));
      // userAudioStream
      //   .getTracks()
      //   .forEach((track) => peerConnection.addTrack(track, userAudioStream));
      // userAudioStream.getTracks().forEach((track) => peerConnection.addTrack(track, userAudioStream));

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          sendMessage(event.candidate, SignalType.Candidate);
        }
      };

      peerConnection.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteAudioStream(event.streams[0]);
        }
      };
    } catch (error) {
      console.error("통화 시작 중 오류가 발생했습니다:", error);
    }
  };

  const handleCheckboxChange = () => {
    setChecked((prev) => !prev);
  };

  const MyToggle = useCallback(
    ({ onClick }: { onClick: () => void }) => {
      return (
        <ToggleContainer onClick={onClick}>
          <MovingToggle checked={checked} />
          <BasicView>원문에서 보기</BasicView>
          <BasicView>한 눈에 보기</BasicView>
        </ToggleContainer>
      );
    },
    [checked]
  );
  const onFilterClick = (newValue: string) => {
    if (filterOption === newValue) {
      setFilterOption(null);
    } else {
      setFilterOption(newValue);
    }
  };

  const FilterOption = () => {
    return (
      <FilterContainer>
        <div>
          <FilterListIcon />
        </div>
        <FilterButton
          $clicked={filterOption === "danger" ? true : false}
          $danger="red"
          onClick={() => onFilterClick("danger")}
        >
          위험
        </FilterButton>
        <FilterButton
          $clicked={filterOption === "caution" ? true : false}
          $danger="orange"
          onClick={() => onFilterClick("caution")}
        >
          주의
        </FilterButton>
        <FilterButton
          $clicked={filterOption === "safe" ? true : false}
          $danger="green"
          onClick={() => onFilterClick("safe")}
        >
          안전
        </FilterButton>
      </FilterContainer>
    );
  };

  const shareBtnClicked = () => {
    setIsCallStarted(true);
    startCall();
    // if (remoteAudioRef.current) {
    //   remoteAudioRef.current.play();
    // }
  };

  const shareLink = async () => {
    // console.log("shareBtnClicked", `${serverUrl}/share/${userId}`);
    const shareData = {
      title: `${state.name}`,
      text: "기미상궁 : 계약서 관리 분석 서비스",
      url: `${serverUrl}/share/${userId}`,
    };
    await navigator.clipboard.writeText(shareData.url);
    alert("공유 링크가 복사되었습니다.");
  };

  const endCall = () => {
    // client.deactivate();
    // isConnectedRef.current = false;
    // Stop all media tracks and close peer connection
    const peerConnection = peerConnectionRef.current;
    if (peerConnection) {
      // Close all tracks
      peerConnection.getSenders().forEach((sender) => {
        peerConnection.removeTrack(sender);
      });

      // Close the peer connection
      peerConnection.close();
      peerConnectionRef.current = null;
    }

    // Deactivate STOMP client
    const stompClient = stompClientRef.current;
    if (stompClient) {
      stompClient.deactivate();
      stompClientRef.current = null;
      isConnectedRef.current = false;
    }

    // Reset WebRTC and STOMP state
    setIsCallStarted(false);
    setRemoteAudioStream(null);

    // Stop any ongoing media streams (e.g., from the remote audio element)
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }
  };
  useEffect(() => {
    const SubContainer = document.getElementById("SubContainer");
    if (selectedToxic && SubContainer) {
      const selectedAccordion = document.getElementById(
        selectedToxic.toString()
      );
      const scrollNum = selectedAccordion?.getBoundingClientRect().top;
      if (scrollNum) {
        SubContainer.scroll({
          top: scrollNum + selectedAccordion.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [checked]);

  return (
    <StyledContainer>
      <ResultNav>
        <BackBtn
          onClick={() => {
            navigate("/home");
          }}
        >
          <ArrowBack />
        </BackBtn>
        <Title>{state.name}</Title>
        {isCallStarted === false ? (
          <ShareBtn onClick={shareBtnClicked}>
            <ScreenShare />
          </ShareBtn>
        ) : (
          <span>
            <ShareBtn
              className="endCall"
              onClick={() => {
                endCall();
              }}
            >
              <CallEnd />
            </ShareBtn>
            <ShareBtn
              className="shareLink"
              onClick={() => {
                shareLink();
              }}
            >
              <Share />
            </ShareBtn>
          </span>
        )}
        <audio ref={remoteAudioRef} autoPlay={true}></audio>
      </ResultNav>
      <MyToggle onClick={handleCheckboxChange} />
      {checked ? (
        <SummaryConatiner className="SummaryContainer" id="SumamryContainer">
          <TrafficLight contractDetail={contractDetail} />

          <FilterOption />
          {contractDetail.clauses.map((e, idx) => {
            if (filterOption === null || e.type === filterOption) {
              return (
                <AccordionExpandIcon
                  title={e.content}
                  text={e.result}
                  type={e.type}
                  key={idx}
                  setChecked={setChecked}
                  selectedToxic={selectedToxic}
                  setSelectedToxic={setSelectedToxic}
                  setShowCarousel={setShowCarousel}
                  showCarousel={showCarousel}
                  idx={idx}
                />
              );
            } else {
              return null;
            }
          })}
        </SummaryConatiner>
      ) : (
        <ToxicDetail
          contractDetail={contractDetail}
          selectedToxic={selectedToxic}
          setSelectedToxic={setSelectedToxic}
          setShowCarousel={setShowCarousel}
          showCarousel={showCarousel}
          setChecked={setChecked}
        />
      )}
    </StyledContainer>
  );
};

export default Result;
