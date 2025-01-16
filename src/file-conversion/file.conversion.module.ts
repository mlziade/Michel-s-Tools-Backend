import { Module } from '@nestjs/common';
import { FileConversionService } from './file.conversion.service';
import { FileConversionController } from './file.conversion.controller';

@Module({
  providers: [FileConversionService],
  controllers: [FileConversionController]
})
export class FileConversionModule {}
