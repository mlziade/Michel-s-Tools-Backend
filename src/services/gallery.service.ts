import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { AwsS3Service } from './aws.s3.service';
import * as crypto from 'crypto';
import { GalleryImage } from 'src/entities/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GalleryThumbnail } from 'src/entities/thumbnail.entity';
import { GalleryResponseDto } from 'src/contracts/response/gallery.contract.response';
import { AwsS3PresignedUrlResponseDto } from 'src/contracts/response/s3.contract.response';
import { REQUEST } from '@nestjs/core';
import { AuthService } from './auth.service';
import { ReducedUserResponseDto } from 'src/contracts/response/user.contract.response';
const sharp = require('sharp');

@Injectable({ scope: Scope.REQUEST })
export class GalleryService {
    constructor(
        @InjectRepository(GalleryImage) private readonly imageRepository: Repository<GalleryImage>,
        @InjectRepository(GalleryThumbnail) private readonly thumbnailRepository: Repository<GalleryThumbnail>,
        @Inject(REQUEST) private readonly request: Request,
        private readonly AwsS3Service: AwsS3Service,
        private readonly AuthService: AuthService,
    ) {}

    async uploadImage(fileName: string, description: string, file: Express.Multer.File): Promise<GalleryResponseDto> {
        const user: ReducedUserResponseDto = await this.AuthService.getUserFromToken(this.request.headers['authorization'])
        const bucketName = process.env.AWS_GALLERY_BUCKET_NAME!;
        const _uuid = crypto.randomBytes(16).toString('hex');

        let thumbnailBuffer: Buffer;
        let thumbnailFileName: string;
        try {
            // Generate resized thumbnail
            thumbnailFileName = this.generateThumbnailFileName(fileName);
            thumbnailBuffer = await sharp(file.buffer)
                .resize(100, 100)
                .toBuffer();
        } catch(error) {
            console.log(error)
            throw new BadRequestException('Invalid image file');
        }
        
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
            createdBy: user,
        });


        return GalleryResponseDto.fromImageAndThumb(image, image.thumbnail);
    }

    async findImageById(id: number, presignUrls: boolean = false): Promise<GalleryResponseDto> {
        const image: GalleryImage = await this.imageRepository.findOne({
            where: { id },
            relations: ['thumbnail'],
        });
        if (!image) {
            throw new NotFoundException('Image not found');
        }

        let imagePresignedUrl: AwsS3PresignedUrlResponseDto | null;
        let thumbnailPresignedUrl: AwsS3PresignedUrlResponseDto | null;
        if (presignUrls) {
            imagePresignedUrl = await this.AwsS3Service.generatePresignedUrl(image.thumbnail.objectKey, image.thumbnail.bucketName);
            thumbnailPresignedUrl = await this.AwsS3Service.generatePresignedUrl(image.objectKey, image.bucketName);
        }

        return GalleryResponseDto.fromImageAndThumb(
            image, 
            image.thumbnail,
            imagePresignedUrl.url,
            thumbnailPresignedUrl.url,
        );
    }

    async findImagesPaginated(page: number, limit: number): Promise<GalleryResponseDto[]> {
        const user: ReducedUserResponseDto = await this.AuthService.getUserFromToken(this.request.headers['authorization'])
        const skip = (page - 1) * limit;
        const images: GalleryImage[] = await this.imageRepository.find({
            where: { createdBy: user },
            relations: ['thumbnail'],
            skip: skip,
            take: limit,
        });

        return images.map(image => GalleryResponseDto.fromImageAndThumb(image, image.thumbnail));
    }

    async generatePresignedUrl(id: number): Promise<AwsS3PresignedUrlResponseDto> {
        const image: GalleryImage = await this.imageRepository.findOne({
            where: { id },
        });
        if (!image) {
            throw new NotFoundException('Image not found');
        }

        return await this.AwsS3Service.generatePresignedUrl(image.objectKey, image.bucketName);
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