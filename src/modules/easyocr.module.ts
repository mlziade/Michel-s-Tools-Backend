import { Module } from '@nestjs/common';
import { EasyOcrController } from 'src/controllers/easyocr.controller';
import { EasyOcrService } from 'src/services/easyocr.services';

@Module({
    imports: [],
    controllers: [EasyOcrController],
    providers: [EasyOcrService],
    exports: [EasyOcrService],
})
export class EasyOcrModule {}