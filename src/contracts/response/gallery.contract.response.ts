import { ApiProperty } from "@nestjs/swagger";
import { GalleryImage } from "src/entities/image.entity";
import { GalleryThumbnail } from "src/entities/thumbnail.entity";
import { User } from "src/entities/user.entity";

export class GalleryResponseDto {
    constructor(partial: Partial<GalleryResponseDto>) {
        Object.assign(this, partial);
    }

    @ApiProperty({ description: 'Unique identifier for the gallery image', example: 1 })
    id: number;

    @ApiProperty({ description: 'Name of the file', example: 'image.jpg' })
    fileName: string;

    @ApiProperty({ description: 'Description of the image', required: false, example: 'A beautiful sunset' })
    description?: string;

    @ApiProperty({ description: 'Date when the image was created', example: '2023-10-01T12:34:56Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Date when the image was last updated', example: '2023-10-02T12:34:56Z' })
    updatedAt: Date;

    @ApiProperty({ description: 'Presigned URL for accessing the image', required: false, example: 'https://example.com/presigned-url' })
    presignedUrl?: string;

    @ApiProperty({ 
        description: 'User who created the image', 
        type: 'object', 
        additionalProperties: true, 
        example: { id: 1, username: 'user1' } 
    })
    createdBy: User;

    @ApiProperty({
        description: 'Thumbnail details',
        type: 'object',
        additionalProperties: true,
        example: {
            id: 2,
            fileName: 'thumbnail.jpg',
            createdAt: '2023-10-01T12:34:56Z',
            updatedAt: '2023-10-02T12:34:56Z',
            presignedUrl: 'https://example.com/thumbnail-presigned-url'
        }
    })
    thumbnail: {
        id: number;
        fileName: string;
        createdAt: Date;
        updatedAt: Date;
        presignedUrl?: string;
    }

    static fromImageAndThumb(image: GalleryImage, thumb: GalleryThumbnail, imgPresignedUrl?: string, thumbPresignedUrl?: string): GalleryResponseDto {
        return new GalleryResponseDto({
            id: image.id,
            fileName: image.fileName,
            description: image.description,
            createdAt: image.createdAt,
            updatedAt: image.updatedAt,
            presignedUrl: imgPresignedUrl ? imgPresignedUrl : undefined,
            thumbnail: {
                id: thumb.id,
                fileName: thumb.fileName,
                createdAt: thumb.createdAt,
                updatedAt: thumb.updatedAt,
                presignedUrl: thumbPresignedUrl ? thumbPresignedUrl : undefined,
            }
        });
    }
}