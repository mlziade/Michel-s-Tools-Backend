import { Module } from '@nestjs/common';
import { OcrService } from '../services/ocr.service';
import { OcrController } from '../controllers/ocr.controller';

@Module({
  providers: [
    OcrService,
  ],
  controllers: [
    // OcrController,
  ],
  exports: [
    OcrService,
  ]
})
export class OcrModule {}
