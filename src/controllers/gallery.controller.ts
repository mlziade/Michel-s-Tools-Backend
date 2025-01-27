import { GalleryService } from "src/services/gallery.service";
import { BadRequestException, Body, Controller, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiKeyGuard } from "src/guards/apikey.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { GalleryUploadValidationPipe } from "src/pipes/gallery.pipes";
import { AuthGuard } from "@nestjs/passport";
import { GalleryResponseDto } from "src/contracts/response/gallery.contract.response";

@Controller('gallery')
@UseGuards(AuthGuard('jwt'))
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

    @Get(':id')
    async findImageById(
        @Param('id') id: number,
        @Query('presigned') presigned: boolean,
    ): Promise<GalleryResponseDto> {
        if (!id) {
            throw new BadRequestException('Image ID is required');
        }

        return await this.galleryService.findImageById(id, presigned);
    }

    @Get()
    async findImagesPaginated(
        @Query('page') page: number,
        @Query('limit') limit: number,
    ): Promise<GalleryResponseDto[]> {
        return await this.galleryService.findImagesPaginated(page, limit);
    }
}