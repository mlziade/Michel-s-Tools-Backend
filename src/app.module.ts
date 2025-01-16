import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileConversionModule } from './modules/file.conversion.module';
import { OcrModule } from './modules/ocr.module';

@Module({
  imports: [FileConversionModule, OcrModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
