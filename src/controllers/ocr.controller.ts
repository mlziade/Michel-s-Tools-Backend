import { Controller, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OcrService } from '../services/ocr.service';
import { ApiKeyGuard } from 'src/guards/apikey.guard';
import { FileOcrFormat } from 'src/contracts/requests/ocr.contract.request';

@Controller('ocr')
@UseGuards(ApiKeyGuard)
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('extract')
  @UseInterceptors(FileInterceptor('file'))
  async extractText(
    @UploadedFile() file: Express.Multer.File,
    @Query('input-format') inputFormat: FileOcrFormat,
  ): Promise<string> {
    const extractedText: string = await this.ocrService.extractTextFromBuffer(
      file.buffer, 
      inputFormat
    );
    
    return extractedText;
  }
}
