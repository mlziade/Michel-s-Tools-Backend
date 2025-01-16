import { Injectable, BadRequestException } from '@nestjs/common';
import * as sharp from 'sharp';
import { FileConsersionFormat } from './file.conversion.contract.request';

@Injectable()
export class FileConversionService {

    constructor() { }

    async convertImage(
        inputBuffer: Buffer,
        outputFormat: string,
        quality?: number,
    ): Promise<Buffer> {
        try {
            return await sharp(inputBuffer)
                .toFormat(outputFormat as keyof sharp.FormatEnum, { quality: quality || 80 })
                .toBuffer();
        } catch (error) {
            console.log(error)
            throw new BadRequestException('Image conversion failed');
        }
    }
}
