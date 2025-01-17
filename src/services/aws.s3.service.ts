import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Buffer } from 'buffer';

@Injectable()
export class AwsS3Service {
    private s3Client: S3Client;

    constructor() {
        this.s3Client = new S3Client({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
            region: process.env.AWS_REGION
        });
    }

    async uploadFile(bucketName: string, file: Express.Multer.File): Promise<void> {
        const uploadParams = {
            Bucket: bucketName,
            Key: file.originalname,
            Body: file.buffer
        };

        const command = new PutObjectCommand(uploadParams);
        try{
            const result = await this.s3Client.send(command);
            return;
        } catch (error) {
            console.error("🚀 ~ AwsS3Service ~ uploadFileToS3 ~ error:", error);
            throw new Error("Error uploading file to S3");
        }
    }

    async getFileStream(fileName: string): Promise<Buffer> {
        const getParams = {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: fileName
        };

        const command = new GetObjectCommand(getParams);
        const result = await this.s3Client.send(command);
        
        // Convert ReadableStream to Buffer
        const responseBuffer = await result.Body?.transformToByteArray();
        return Buffer.from(responseBuffer!);
    }
}
