import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import styled from "styled-components";

const signalingServerURL = process.env.REACT_APP_SIGNALING_SERVER_URL;

enum SignalType {
  Offer = "offer",
  Answer = "answer",
  Candidate = "candidate",
}

const Container = styled.div`
  min-height: 100%;
  padding: 1rem;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
  .title {
    height: 10%;
    text-align: center;
  }
  button {
    width: 100%;
  }
  .body {
    flex-grow: 1;
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
  }
  video {
    width: 100%;
    flex-grow: 1;
  }
`;

// 화면 공유 받는 사람의 컴포넌트
// 여긴 화면 디자인만 하면 됨
// 이 화면이 켜지는 순간 바로 화면 공유 받아서 띄움
const Share = () => {
  const [remoteVideoStream, setRemoteVideoStream] =
    useState<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const stompClientRef = useRef<Client | null>(null);
  const isConnectedRef = useRef<boolean>(false);
  const { roomId } = useParams<{ roomId: string }>();
  const numericRoomId = roomId ? parseInt(roomId, 10) : NaN;
  const iceCandidatesQueue = useRef<RTCIceCandidate[]>([]);

  const [isCallStarted, setIsCallStarted] = useState(false);
  // useEffect(() => {
  //   if (!peerConnectionRef.current) {
  //     startCall();
  //   }
  // });

  useEffect(() => {
    if (isNaN(numericRoomId)) {
      console.error("Invalid roomId");
      return;
    }

    const client = new Client({
      brokerURL: signalingServerURL,
      debug: (str) => console.log(str),
      onConnect: () => {
        isConnectedRef.current = true;
        client.subscribe(`/topic/peer/answer/${numericRoomId}`, (message) => {
          handleSignalingMessage(JSON.parse(message.body), SignalType.Answer);
        });
        client.subscribe(
          `/topic/peer/iceCandidate/${numericRoomId}`,
          (message) => {
            handleSignalingMessage(
              JSON.parse(message.body),
              SignalType.Candidate
            );
          }
        );
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
  }, [numericRoomId]);

  useEffect(() => {
    if (remoteVideoStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteVideoStream;
    }
  }, [remoteVideoStream]);

  const handleSignalingMessage = async (message: any, type: SignalType) => {
    const peerConnection = peerConnectionRef.current;
    if (!peerConnection) return;

    switch (type) {
      case SignalType.Answer:
        // Answer를 수신했을 때, 로컬에서 Offer가 생성된 상태인지 확인
        if (peerConnection.signalingState === "have-local-offer") {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(message)
          );

          // 큐에 있는 ICE 후보들을 처리
          iceCandidatesQueue.current.forEach((candidate) => {
            peerConnection.addIceCandidate(candidate);
          });
          iceCandidatesQueue.current = [];
        } else {
          console.error("현재 상태에서는 응답을 수락할 수 없습니다.");
        }
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
        [SignalType.Offer]: `/app/peer/offer/${numericRoomId}`,
        [SignalType.Answer]: `/app/peer/answer/${numericRoomId}`,
        [SignalType.Candidate]: `/app/peer/iceCandidate/${numericRoomId}`,
      }[type];

      stompClientRef.current.publish({
        destination: destination,
        body: JSON.stringify(message),
      });
    } else {
      console.error("STOMP 클라이언트가 연결되지 않았습니다.");
    }
  };

  const startCall = async () => {
    setIsCallStarted(true);
    try {
      // const userAudioStream = await navigator.mediaDevices.getUserMedia({
      //   audio: true,
      //   video: true,
      // });
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

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

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          sendMessage(event.candidate, SignalType.Candidate);
        }
      };

      const recevier = peerConnection.getReceivers();

      peerConnection.ontrack = (event) => {
        if (event.streams.length > 0) {
          setRemoteVideoStream(event.streams[0]);
        }
      };

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      sendMessage(offer, SignalType.Offer);
    } catch (error) {
      console.error("통화 시작 중 오류가 발생했습니다:", error);
    }
  };

  return (
    <Container>
      <div className="title">
        <span>기미상궁 : 계약서 분석 관리 서비스</span>
      </div>
      <div>
        <button
          onClick={startCall}
          style={{ visibility: isCallStarted ? "hidden" : "visible" }}
        >
          통화 시작
        </button>
      </div>
      <div className="body">
        <video ref={remoteVideoRef} autoPlay />
        {/* <audio ref={remoteVideoRef} autoPlay /> */}
      </div>
    </Container>
  );
};

export default Share;
