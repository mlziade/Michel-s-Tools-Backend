import { Module } from '@nestjs/common';
import { GalleryController } from 'src/controllers/gallery.controller';
import { GalleryService } from 'src/services/gallery.service';
import { AwsS3Module } from './aws.s3.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalleryImage } from 'src/entities/image.entity';
import { GalleryThumbnail } from 'src/entities/thumbnail.entity';
import { AuthModule } from './auth.module';


@Module({
    imports: [
        TypeOrmModule.forFeature([
            GalleryImage,
            GalleryThumbnail,
        ]),
        AwsS3Module,
        AuthModule,
    ],
    providers: [
        GalleryService,
    ],
    controllers: [
        GalleryController,
    ],
    exports: [
        GalleryService,
    ],
})
export class GalleryModule {}
