export class AwsS3PresignedUrlResponseDto {
    constructor(partial: Partial<AwsS3PresignedUrlResponseDto>) {
        Object.assign(this, partial);
    }

    url: string;
    objectKey: string;
    startDate: Date;
    expirationDate: Date;
}