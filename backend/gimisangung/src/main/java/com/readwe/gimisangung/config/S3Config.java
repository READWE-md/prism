package com.readwe.gimisangung.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

@Configuration
class S3Config {
	@Value("${aws.s3.accessKey}")
	private String accessKey;
	@Value("${aws.s3.secretKey}")
	private String secretKey;
	@Value("${aws.s3.region}")
	private String region;

	@Bean
	public S3Client s3Client() {
		AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKey, secretKey);

		return S3Client.builder()
			.region(Region.of(region))
			.credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
			.serviceConfiguration(S3Configuration.builder()
				.build())
			.build();
	}
}