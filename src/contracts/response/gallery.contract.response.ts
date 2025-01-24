import { GalleryImage } from "src/entities/image.entity";
import { GalleryThumbnail } from "src/entities/thumbnail.entity";

export class GalleryResponseDto {
    constructor(partial: Partial<GalleryResponseDto>) {
        Object.assign(this, partial);
    }

    id: number;
    fileName: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    presignedUrl?: string;
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