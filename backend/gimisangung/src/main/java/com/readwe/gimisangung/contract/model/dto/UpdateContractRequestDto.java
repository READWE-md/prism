package com.readwe.gimisangung.contract.model.dto;

import java.util.List;
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
}