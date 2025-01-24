import { Controller, Post, Get, UploadedFile, UseInterceptors, Res, Param, UseGuards, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from '../services/aws.s3.service';
import { Response } from 'express';
import { ApiKeyGuard } from 'src/guards/apikey.guard';

@Controller('aws-s3')
@UseGuards(ApiKeyGuard)
export class AwsS3Controller {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  /* @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('bucketName') bucketName: string,
  ) {
    const result = await this.awsS3Service.uploadFile(bucketName, file);
    return result;
  } */
}