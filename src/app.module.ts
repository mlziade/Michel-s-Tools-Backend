import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileConversionModule } from './modules/file.conversion.module';
import { OcrModule } from './modules/ocr.module';
import { ConfigModule } from '@nestjs/config';
import { OllamaController } from './controllers/ollama.controller';
import { OllamaModule } from './modules/ollama.module';
import { AwsS3Module } from './modules/aws.s3.module';
import { GalleryModule } from './modules/gallery.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './controllers/user.controller';
import { UserModule } from './modules/user.module';
import { GalleryImage } from './entities/image.entity';
import { GalleryThumbnail } from './entities/thumbnail.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: parseInt(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [
        User,
        GalleryImage,
        GalleryThumbnail,
      ],
      synchronize: true,
    }),
    FileConversionModule, 
    OcrModule,
    OllamaModule,
    AwsS3Module,
    GalleryModule,
    UserModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService
  ],
})
export class AppModule {}
