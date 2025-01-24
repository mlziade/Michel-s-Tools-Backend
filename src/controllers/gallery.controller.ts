import { GalleryService } from "src/services/gallery.service";
import { BadRequestException, Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiKeyGuard } from "src/guards/apikey.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { GalleryUploadValidationPipe } from "src/pipes/gallery.pipes";

@Controller('gallery')
@UseGuards(ApiKeyGuard)
export class GalleryController {
    constructor(
        private readonly galleryService: GalleryService,
    ) { }

    @UseInterceptors(FileInterceptor('file'))
    @Post('upload')
    async uploadImage(
        @UploadedFile(new GalleryUploadValidationPipe()) file: Express.Multer.File,
        @Body() fileInfo: { fileName: string, description?: string },
    ): Promise<any> {
        if (!fileInfo.fileName) {
            throw new BadRequestException('File name is required');
        }

        return await this.galleryService.uploadImage(fileInfo.fileName, fileInfo.description, file);
    }
}