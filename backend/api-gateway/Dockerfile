FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
ENV JAVA_OPTS=""
COPY target/*.jar app.jar
EXPOSE 9090
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]


