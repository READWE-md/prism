// package com.readwe.gimisangung.contract.controller;
//
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
// import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
// import org.springframework.boot.test.mock.mockito.MockBean;
// import org.springframework.test.context.junit.jupiter.SpringExtension;
// import org.springframework.test.web.servlet.MockMvc;
//
// import com.readwe.gimisangung.contract.model.service.ContractService;
//
// @ExtendWith(SpringExtension.class)
// @WebMvcTest(
// 	controllers = ContractController.class,
// 	excludeAutoConfiguration = SecurityAutoConfiguration.class
// )
// class ContractControllerTest {
//
// 	@Autowired
// 	private MockMvc mockMvc;
//
// 	@MockBean
// 	public ContractService contractService;
//
// 	@Test
// 	void analyzeContract() throws Exception {
// 		// given
// 		// Mockito.when(contractService.analyzeContract(Mockito.any(List.class))).thenReturn(new AnalyzeResultDto());
// 		// List<String> encodedImages = new ArrayList<>();
// 		// encodedImages.add("");
// 		//
// 		// CreateContractRequestDto createContractRequestDto = new CreateContractRequestDto(encodedImages);
// 		// ObjectMapper objectMapper = new ObjectMapper();
// 		// String requestBody = objectMapper.writeValueAsString(createContractRequestDto);
//
// 		// when
//
// 		// then
// 		// mockMvc.perform(post("/api/v1/contracts").content(requestBody).contentType(MediaType.APPLICATION_JSON)).andExpect(status().isCreated());
// 	}
// }