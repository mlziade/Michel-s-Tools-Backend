import { Injectable } from '@nestjs/common';
import { AwsS3Service } from './aws.s3.service';
import * as crypto from 'crypto';
import { GalleryImage } from 'src/entities/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GalleryThumbnail } from 'src/entities/thumbnail.entity';
import { GalleryResponseDto } from 'src/contracts/response/gallery.contract.response';
const sharp = require('sharp');

@Injectable()
export class GalleryService {
    constructor(
        @InjectRepository(GalleryImage) private readonly imageRepository: Repository<GalleryImage>,
        @InjectRepository(GalleryThumbnail) private readonly thumbnailRepository: Repository<GalleryThumbnail>,
        private readonly AwsS3Service: AwsS3Service,
    ) {}

    async uploadImage(fileName: string, description: string, file: Express.Multer.File): Promise<GalleryResponseDto> {
        const bucketName = process.env.AWS_GALLERY_BUCKET_NAME!;
        const _uuid = crypto.randomBytes(16).toString('hex');

        // Generate resized thumbnail
        const thumbnailFileName = this.generateThumbnailFileName(fileName);
        const thumbnailBuffer = await sharp(file.buffer)
        .resize(100, 100)
        .toBuffer();

        // Upload image and thumbnail
        await this.AwsS3Service.uploadFile(
            this.generateFullPath(_uuid, fileName),
            bucketName, 
            thumbnailBuffer
        );
        await this.AwsS3Service.uploadFile(
            this.generateFullPath(_uuid, thumbnailFileName),
            bucketName, 
            file.buffer
        );

        const thumbnail = await this.thumbnailRepository.save({
            fileName: thumbnailFileName,
            description: description,
            objectKey: thumbnailFileName,
            s3Uri: this.generateS3Uri(thumbnailFileName, bucketName),
            objectUrl: this.generateObjectUrl(thumbnailFileName, bucketName),
            bucketName: bucketName,
        });

        const image = await this.imageRepository.save({
            fileName: fileName,
            description: description,
            objectKey: fileName,
            s3Uri: this.generateS3Uri(fileName, bucketName),
            objectUrl: this.generateObjectUrl(fileName, bucketName),
            bucketName: bucketName,
            thumbnail: thumbnail,
        });


        return new GalleryResponseDto(image, thumbnail);
    }

    generateFullPath(uuid: string, fileName: string): string {
        return `${uuid}/${fileName}`;
    }

    generateS3Uri(objectKey: string, bucketName: string): string {
        return `s3://${bucketName}/${objectKey}`;
    }

    generateObjectUrl(objectKey: string, bucketName: string): string {
        return `https://${bucketName}.s3.amazonaws.com/${objectKey}`;
    }

    generateThumbnailFileName(objectKey: string): string {
        return `thumbnail_${objectKey}`;
    }
}