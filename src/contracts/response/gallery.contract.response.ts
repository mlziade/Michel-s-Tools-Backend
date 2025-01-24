import { GalleryImage } from "src/entities/image.entity";
import { GalleryThumbnail } from "src/entities/thumbnail.entity";

export class GalleryResponseDto {
    id: number;
    fileName: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    thumbnail: {
        id: number;
        fileName: string;
        createdAt: Date;
        updatedAt: Date;
    }

    constructor(image: GalleryImage, thumb: GalleryThumbnail) {
        this.id = image.id;
        this.fileName = image.fileName;
        this.description = image.description;
        this.createdAt = image.createdAt;
        this.updatedAt = image.updatedAt;
        this.thumbnail = {
            id: thumb.id,
            fileName: thumb.fileName,
            createdAt: thumb.createdAt,
            updatedAt: thumb.updatedAt,
        }
    }
}