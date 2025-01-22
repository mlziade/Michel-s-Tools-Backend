import { Module } from '@nestjs/common';
import { AwsS3Controller } from 'src/controllers/aws.s3.controller';
import { AwsS3Service } from 'src/services/aws.s3.service';

@Module({
  providers: [
    AwsS3Service,
  ],
  controllers: [
    AwsS3Controller,
  ],
  exports: [
    AwsS3Service,
  ]
})
export class AwsS3Module {}
