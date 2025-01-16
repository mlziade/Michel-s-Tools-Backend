import { Module } from '@nestjs/common';
import { FileConversionService } from '../file-conversion/file.conversion.service';
import { FileConversionController } from '../controllers/file.conversion.controller';

@Module({
  providers: [FileConversionService],
  controllers: [FileConversionController]
})
export class FileConversionModule {}
