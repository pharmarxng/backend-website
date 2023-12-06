import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const port = process.env.PORT || 4001;
  const options = new DocumentBuilder()
    .setTitle('PharmaRx')
    .setDescription(`PharmaRx's API description`)
    .addBearerAuth();

  const document = SwaggerModule.createDocument(app, options.build());
  SwaggerModule.setup('api/pharmaRx/docs', app, document);
  await app.listen(port, () => {
    Logger.log(
      `
      ################################################
      🛡️ PharmaRx is running! Access URLs:
      🏠 Local:      http://localhost:${port}
      ################################################
      `,
    );
    Logger.log(
      `
      ################################################
      🛡️ PharmaRx is running! Access URLs:
      🏠 Local:      http://localhost:${port}/api/pharmaRx/docs
      ################################################
      `,
    );
  });
}
bootstrap();
