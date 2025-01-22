import { UUID } from "crypto";

/*
* Each image in the gallery will have its own folder on s3
* The folder will contain the image and its thumbnail
*/

export class GalleryImage {
    constructor(partial: Partial<GalleryImage>) {
        Object.assign(this, partial);
    }

    id: UUID;
    fileName: string;
    description?: string;
    s3Uri: string;
    createdAt: Date;
    updatedAt: Date;
    bucketName: string;
    objectKey: string;
    objectUrl: string;
    thumbnail: {
        s3Uri: string;
        objectKey: string;
        objectUrl: string;
    }

    static generateS3Uri(objectKey: string, bucketName: string): string {
        return `s3://${bucketName}/${objectKey}`;
    }

    static generateObjectUrl(objectKey: string, bucketName: string): string {
        return `https://${bucketName}.s3.amazonaws.com/${objectKey}`;
    }

    static generateThumbnailFileName(objectKey: string): string {
        return `thumbnail_${objectKey}`;
    }
}