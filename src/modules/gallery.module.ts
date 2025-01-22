import { Module } from '@nestjs/common';
import { GalleryController } from 'src/controllers/gallery.controller';
import { GalleryService } from 'src/services/gallery.service';
import { AwsS3Module } from './aws.s3.module';


@Module({
    imports: [
        AwsS3Module,
    ],
    providers: [
        GalleryService,
    ],
    controllers: [
        GalleryController,
    ]
})
export class GalleryModule {}
