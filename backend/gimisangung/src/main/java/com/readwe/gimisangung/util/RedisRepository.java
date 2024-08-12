package com.readwe.gimisangung.util;

import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class RedisRepository {

	private final RedisTemplate<String, Object> redisTemplate;

	public void setData(String key, String value, Long expiredTime){
		redisTemplate.opsForValue().set(key, value, expiredTime, TimeUnit.MILLISECONDS);
	}

	public boolean setDataIfAbsent(String key, String value, Long expiredTime) {
		return Boolean.TRUE.equals(
			redisTemplate.opsForValue().setIfAbsent(key, value, expiredTime, TimeUnit.MILLISECONDS));
	}

	public String getData(String key){
		return (String) redisTemplate.opsForValue().get(key);
	}

	public void deleteData(String key){
		redisTemplate.delete(key);
	}
}
