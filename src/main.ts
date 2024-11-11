import { NestFactory } from "@nestjs/core";
import * as dotenv from "dotenv";
dotenv.config();
import AppModel from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModel);
  app.enableCors({
    allowedHeaders: "*",
    origin: "*",
  });
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  const config = new DocumentBuilder()
    .setTitle("Fraud-Wall Client API")
    .setDescription(
      "This API helps to extend functionalities to manage Fraud Wall application"
    )
    .setVersion("1.0")
    .addApiKey({ type: "apiKey", name: "X-API-KEY", in: "header" })
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  document.components.securitySchemes = {
    apiKey: {
      type: "apiKey",
      name: "X-API-KEY",
      in: "header",
    },
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  };
  document.security = [{ bearerAuth: [], apiKey: [] }];
  SwaggerModule.setup("v1/docs", app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
