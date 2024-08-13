import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { RootState } from "../reducer";
import { useSelector } from "react-redux";

const signalingServerURL = process.env.REACT_APP_SIGNALING_SERVER_URL;

enum SignalType {
  Offer = "offer",
  Answer = "answer",
  Candidate = "candidate",
}

const Share = () => {
  const [remoteAudioStream, setRemoteAudioStream] =
    useState<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const stompClientRef = useRef<Client | null>(null);
  const isConnectedRef = useRef<boolean>(false);
  const { userId } = useSelector((state: RootState) => state.account);
  const iceCandidatesQueue = useRef<RTCIceCandidate[]>([]);

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
  }, [userId]);

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

      const userAudioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      displayStream.addTrack(userAudioStream.getTracks()[0]);

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

  return (
    <>
      <h1>WebRTC Share</h1>
      <button onClick={startCall}>통화 시작</button>

      <div>
        {true && (
          <>
            <h2>로컬 스트림</h2>
            <audio ref={remoteAudioRef} autoPlay></audio>
          </>
        )}
      </div>
    </>
  );
};

export default Share;
