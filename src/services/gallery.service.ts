import { Injectable } from '@nestjs/common';
import { AwsS3Service } from './aws.s3.service';
import { GalleryImage } from 'src/models/galleryImage';
import * as crypto from 'crypto';
import { UUID } from 'crypto';
const sharp = require('sharp');

@Injectable()
export class GalleryService {
    constructor(
        private readonly AwsS3Service: AwsS3Service,
    ) {}

    async uploadImage(fileName: string, description: string, file: Express.Multer.File): Promise<GalleryImage> {
        const bucketName = process.env.AWS_GALLERY_BUCKET_NAME!;
        const createdAt = new Date();
        const uuid = crypto.randomUUID();

        // Generate resized thumbnail
        const thumbnailFileName = GalleryImage.generateThumbnailFileName(fileName);
        const thumbnailBuffer = await sharp(file.buffer)
        .resize(100, 100)
        .toBuffer();

        // Upload image and thumbnail
        await this.AwsS3Service.uploadFile(
            GalleryService.generateFullPath(uuid, fileName),
            bucketName, 
            thumbnailBuffer
        );
        await this.AwsS3Service.uploadFile(
            GalleryService.generateFullPath(uuid, thumbnailFileName),
            bucketName, 
            file.buffer
        );

        // Create GalleryImage object
        const image = new GalleryImage({
            id: uuid,
            fileName: fileName,
            description: description,
            objectKey: fileName,
            s3Uri: GalleryImage.generateS3Uri(fileName, bucketName),
            objectUrl: GalleryImage.generateObjectUrl(fileName, bucketName),
            bucketName: bucketName,
            createdAt: createdAt,
            updatedAt: createdAt,
            thumbnail: {
                objectKey: GalleryImage.generateThumbnailFileName(fileName),
                s3Uri: GalleryImage.generateS3Uri(
                    GalleryService.generateFullPath(uuid, thumbnailFileName), 
                    bucketName
                ),
                objectUrl: GalleryImage.generateObjectUrl(
                    GalleryService.generateFullPath(uuid, thumbnailFileName), 
                    bucketName
                ),
            }
        });

        return image;
    }

    static generateFullPath(uuid: UUID, fileName: string): string {
        return `${uuid}/${fileName}`;
    }
}