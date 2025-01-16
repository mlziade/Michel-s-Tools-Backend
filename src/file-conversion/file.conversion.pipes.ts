import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { FileConversionFormat } from './file.conversion.contract.request';

@Injectable()
export class FileConversionFileValidationPipe implements PipeTransform {
    transform(value: any, _metadata: ArgumentMetadata) {
        if (!value) {
            throw new BadRequestException('File is required');
        }

        if (!Object.values(FileConversionFormat).includes(value.mimetype)) {
            throw new BadRequestException('Invalid file format');
        }

        return value;
    }
}

@Injectable()
export class FileConversionOutputFormatValidationPipe implements PipeTransform {
    transform(value: any, _metadata: ArgumentMetadata) {
        if (!value) {
            throw new BadRequestException('Output format is required');
        }

        if (!Object.values(FileConversionFormat).includes(value)) {
            throw new BadRequestException('Invalid output format');
        }

        return value;
    }
}


@Injectable()
export class FileConversionQualityValidationPipe implements PipeTransform {
    transform(value: any, _metadata: ArgumentMetadata) {
        if (!value) {
            return undefined;
        }

        if ( value < 1 || value < 100) {
            throw new BadRequestException('Invalid quality. Quality should be between 1 and 100');
        }

        return value;
    }
}