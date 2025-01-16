import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileConversionModule } from './file-conversion/file.conversion.module';

@Module({
  imports: [FileConversionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
