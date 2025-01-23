import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileConversionModule } from './modules/file.conversion.module';
import { OcrModule } from './modules/ocr.module';
import { ConfigModule } from '@nestjs/config';
import { OllamaController } from './controllers/ollama.controller';
import { OllamaModule } from './modules/ollama.module';
import { AwsS3Module } from './modules/aws.s3.module';
import { GalleryModule } from './modules/gallery.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: '/usr/src/app/database/sqlite.db',
      entities: [],
      synchronize: true,
    }),
    ConfigModule.forRoot(),
    FileConversionModule, 
    OcrModule,
    OllamaModule,
    AwsS3Module,
    GalleryModule
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService
  ],
})
export class AppModule {}
