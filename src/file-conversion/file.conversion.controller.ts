import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
    Body,
    Res,
    StreamableFile,
    Param,
    Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileConversionService } from './file.conversion.service';
import { FileConversionValidationPipe } from './file.conversion.pipeline';

@Controller('file-conversion')
export class FileConversionController {

    constructor(
        private readonly fileConversionService: FileConversionService,
    ) { }

    @Post('image')
    @UseInterceptors(FileInterceptor('file'))
    async convertImage(
        @UploadedFile(new FileConversionValidationPipe()) file: Express.Multer.File,
        @Query('outputFormat') outputFormat: string,
        @Query('quality') quality: number,
    ): Promise<StreamableFile> {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        const inputBuffer = file.buffer;
        const convertedImage = await this.fileConversionService.convertImage(
            inputBuffer,
            outputFormat,
            quality,
        );

        return new StreamableFile(convertedImage, {
            type: 'application/octet-stream',
            disposition: `attachment; filename="${file.filename}.${outputFormat}"`,
        });
    }
}