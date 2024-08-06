package com.readwe.gimisangung.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Value("${spring.url}")
	private String url;

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry
			.addMapping("/**") // 허용하려는 API 요청 경로
			.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용하려는 HTTP Method 설정 (OPTIONS는 Preflight 설정)
			.allowedOrigins(url) // 허용하려는 클라이언트 측 주소
			.allowCredentials(true) // HttpOnly Cookie를 사용하기 위한 설정
			.maxAge(3600); // Preflight Cache 설정
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/resources/**")
			.addResourceLocations("classpath:/images/");
	}

}
