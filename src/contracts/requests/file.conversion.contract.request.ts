import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export enum FileConversionFormat {
  jpeg = 'image/jpeg',
  png = 'image/png',
  webp = 'image/webp',
}

export class FileConversionRequestDto {
  @IsNotEmpty()
  @IsEnum(FileConversionFormat)
  format: string;

  @IsNotEmpty()
  @IsEnum(FileConversionFormat)
  outputFormat: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  quality?: number;
}
