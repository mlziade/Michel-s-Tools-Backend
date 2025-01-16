import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { FileConsersionFormat } from './file.conversion.contract.request';

@Injectable()
export class FileConversionValidationPipe implements PipeTransform {
    transform(value: any, _metadata: ArgumentMetadata) {
        if (!value) {
            throw new BadRequestException('File is required');
        }

        if (!Object.values(FileConsersionFormat).includes(value.mimetype)) {
            throw new BadRequestException('Invalid file format');
        }

        return value;
    }
}
