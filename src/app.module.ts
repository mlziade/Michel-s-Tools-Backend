import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileConversionModule } from './file-conversion/file.conversion.module';
import { OcrModule } from './ocr/ocr.module';

@Module({
  imports: [FileConversionModule, OcrModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
