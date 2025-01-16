import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export enum FileConsersionFormat {
  jpeg = 'image/jpeg',
  png = 'image/png',
  webp = 'image/webp',
}

export class FileConversionRequestDto {
  @IsNotEmpty()
  @IsEnum(FileConsersionFormat)
  format: string;

  @IsNotEmpty()
  @IsEnum(FileConsersionFormat)
  outputFormat: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  quality?: number;
}
