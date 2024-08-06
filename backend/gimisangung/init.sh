#!/bin/sh
echo "Starting process..."
chmod 744 ./gradlew
./gradlew clean build
java -jar ./build/libs/gimisangung-0.0.1-SNAPSHOT.jar --spring.profiles.active=production
