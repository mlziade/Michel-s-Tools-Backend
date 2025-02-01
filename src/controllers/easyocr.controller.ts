import { Body, Controller, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EasyOcrAvailableLanguages, EasyOcrService } from 'src/services/easyocr.services';

@Controller('easyocr')
export class EasyOcrController {
    constructor(
        private readonly easyOcrService: EasyOcrService,
    ) {}

    @Post('extractTextFromImage')
    @UseInterceptors(FileInterceptor('image'))
    async extractTextFromImage(
        @Query('language') language: string,
        @UploadedFile() image: Express.Multer.File,
    ) {
        return this.easyOcrService.extractTextFromImage(
            image, 
            language as EasyOcrAvailableLanguages
        );
    }
}