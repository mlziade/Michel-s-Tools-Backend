import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileConversionModule } from './modules/file.conversion.module';
import { OcrModule } from './modules/ocr.module';
import { ConfigModule } from '@nestjs/config';
import { OllamaController } from './controllers/ollama.controller';
import { OllamaModule } from './modules/ollama.module';
import { AwsS3Module } from './modules/aws.s3.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    FileConversionModule, 
    OcrModule,
    OllamaModule,
    AwsS3Module
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],
})
export class AppModule {}
