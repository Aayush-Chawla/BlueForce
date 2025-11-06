FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

ARG JAR_FILE=target/certificate-service-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

EXPOSE 8093

ENV JAVA_OPTS=""
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]


