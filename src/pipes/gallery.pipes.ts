import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

export enum GalleryImageTypes {
    'image/jpeg' = 'image/jpeg',
    'image/png' = 'image/png',
    'image/gif' = 'image/gif',
}


@Injectable()
export class GalleryUploadValidationPipe implements PipeTransform {
    transform(value: any, _metadata: ArgumentMetadata) {
       if (!value) {
           throw new BadRequestException('File is required');
       }

       if (!Object.values(GalleryImageTypes).includes(value.mimetype)) {
           throw new BadRequestException('Invalid file format');
       }

         return value;
    }
}