FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /build

COPY . .

RUN mvn package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /build/target/quarkus-app /app/

EXPOSE 8080

ENV QUARKUS_HTTP_PORT=8080

CMD ["java", "-jar", "quarkus-run.jar"]