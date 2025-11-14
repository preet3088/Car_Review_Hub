# -------- BUILD STAGE --------
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy only pom.xml first (Dependency caching)
COPY pom.xml .

RUN mvn -q -e -DskipTests dependency:resolve dependency:resolve-plugins

# Now copy source
COPY src ./src

# Build project
RUN mvn -q -DskipTests package

# -------- RUN STAGE --------
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
