package com.readwe.gimisangung.contract.model.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ContractStatus {
	ANALYZE_INIT,
	ANALYZE_OCR_START,
	ANALYZE_OCR_DONE,
	ANALYZE_TOKENIZE_START,
	ANALYZE_TOKENIZE_DONE,
	ANALYZE_LINE_TO_TOPIC_START,
	ANALYZE_LINE_TO_TOPIC_END,
	ANALYZE_CORRECTION_START,
	ANALYZE_CORRECTION_END,
	ANALYZE_CHECK_START,
	ANALYZE_CHECK_END,
	TAG_GEN_START,
	TAG_GEN_END,
	DONE
}
