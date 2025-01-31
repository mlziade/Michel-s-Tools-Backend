import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, StorageClass, CreateBucketCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Buffer } from 'buffer';
import { AwsS3PresignedUrlResponseDto } from 'src/contracts/response/s3.contract.response';

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

    async createBucket(bucketName: string): Promise<void> {
        const command = new CreateBucketCommand({
            Bucket: bucketName,
        });

        try {
            await this.s3Client.send(command);
        } catch (error) {
            throw new Error("Error creating bucket in S3");
        }
    }

    async uploadFile(fileFullPath: string, bucketName: string, file: Express.Multer.File | Buffer, storageClass: StorageClass = 'STANDARD'): Promise<void> {
        const uploadParams = {
            Bucket: bucketName,
            Key: fileFullPath,
            Body: file instanceof Buffer ? file : new Uint8Array(file.buffer),
            StorageClass: storageClass ? storageClass : 'STANDARD',
        };

        const command = new PutObjectCommand(uploadParams);
        try {
            await this.s3Client.send(command);
        } catch (error) {
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

    async generatePresignedUrl(fileName: string, bucketName: string): Promise<AwsS3PresignedUrlResponseDto> {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName
        });

        try {
            // Generate a presigned URL for the PutObjectCommand
            const url = await getSignedUrl(
                this.s3Client, 
                command, 
                { expiresIn: 3600 }
            );

            // Return the presigned URL dto
            return new AwsS3PresignedUrlResponseDto({
                url: url,
                objectKey: fileName,
                startDate: new Date(),
                expirationDate: new Date(Date.now() + 3600 * 1000)
            });
        } catch (error) {
            console.error("🚀 ~ AwsS3Service ~ generateUploadPresignedUrl ~ error:", error);
            throw new Error("Error generating presigned URL");
        }
    }

    async listObjects(folderPath: string, bucketName: string): Promise<string[]> {
        const command = new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: folderPath,
        });

        try {
            const response = await this.s3Client.send(command);
            return response.Contents?.map((content) => content.Key!) || [];
        } catch (error) {
            console.error("🚀 ~ AwsS3Service ~ listObjects ~ error:", error);
            throw new Error("Error listing objects in S3");
        }
    }        
}
