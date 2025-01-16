import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
    StreamableFile,
    Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileConversionService } from './file.conversion.service';
import { FileConversionFormat } from './file.conversion.contract.request';
import { FileConversionFileValidationPipe, FileConversionOutputFormatValidationPipe, FileConversionQualityValidationPipe } from './file.conversion.pipes';

@Controller('file-conversion')
export class FileConversionController {

    constructor(
        private readonly fileConversionService: FileConversionService,
    ) { }

    @Post('image')
    @UseInterceptors(FileInterceptor('file'))
    async convertImage(
        @UploadedFile(new FileConversionFileValidationPipe()) file: Express.Multer.File,
        @Query('outputFormat', new FileConversionOutputFormatValidationPipe()) outputFormat: FileConversionFormat,
        @Query('quality', new FileConversionQualityValidationPipe()) quality: number,
    ): Promise<StreamableFile> {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        const inputBuffer = file.buffer;
        const convertedImage: Buffer = await this.fileConversionService.convertImage(
            inputBuffer,
            outputFormat,
            quality,
        );

        const fileName: string = FileConversionService.extractFileName(file.originalname);

        return new StreamableFile(convertedImage, {
            type: 'application/octet-stream',
            disposition: `attachment; filename="${fileName}.${outputFormat}"`,
        });
    }
}