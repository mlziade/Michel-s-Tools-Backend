import { Module } from '@nestjs/common';
import { FileConversionController } from '../controllers/file.conversion.controller';
import { FileConversionService } from 'src/services/file.conversion.service';

@Module({
  providers: [FileConversionService],
  controllers: [FileConversionController]
})
export class FileConversionModule {}
