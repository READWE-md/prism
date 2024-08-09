#!/bin/sh
echo "Starting process..."
apt-get install -y redis-server
service redis-server restart
chmod 744 ./gradlew
./gradlew clean build
java -jar ./build/libs/gimisangung-0.0.1-SNAPSHOT.jar --spring.profiles.active=production
