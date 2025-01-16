import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileConversionModule } from './modules/file.conversion.module';
import { OcrModule } from './modules/ocr.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    FileConversionModule, 
    OcrModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
