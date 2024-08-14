package com.readwe.gimisangung.contract.model.dto;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateContractRequestDto {
   private String name;
   private Long parentId;
   private List<String> tags;
   // @DateTimeFormat(pattern = "yyyy-MM-dd")
   // private LocalDateTime startDate;
   // @DateTimeFormat(pattern = "yyyy-MM-dd")
   // private LocalDateTime expireDate;
}