package com.readwe.gimisangung;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SignalingController {

	/**
	 * MessageMapping 경로로 들어온 offer 요청을 SendTo 경로로 전달하는 메서드
	 * @param offer
	 * @param camKey
	 * @param roomId
	 * @return
	 */
	@MessageMapping("/peer/offer/{roomId}")
	@SendTo("/topic/peer/offer/{roomId}")
	public String peerHandleOffer(@Payload String offer, @PathVariable("camKey") String camKey, @PathVariable("roomId") String roomId) {
		return offer;
	}

	@MessageMapping("/peer/iceCandidate/{roomId}")
	@SendTo("/topic/peer/iceCandidate/{roomId}")
	public String peerHandleIceCandidate(@Payload String candidate, @PathVariable("camKey") String camKey, @PathVariable("roomId") String roomId) {
		return candidate;
	}

	@MessageMapping("/peer/answer/{roomId}")
	@SendTo("/topic/peer/answer/{roomId}")
	public String peerHandleAnswer(@Payload String answer, @PathVariable("camKey") String camKey, @PathVariable("roomId") String roomId) {
		return answer;
	}
}
