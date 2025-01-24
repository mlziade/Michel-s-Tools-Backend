import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum FileConversionFormat {
  jpeg = 'image/jpeg',
  png = 'image/png',
  webp = 'image/webp',
}

export class FileConversionRequestDto {
  @ApiProperty({ enum: FileConversionFormat })
  @IsNotEmpty()
  @IsEnum(FileConversionFormat)
  format: string;

  @ApiProperty({ enum: FileConversionFormat })
  @IsNotEmpty()
  @IsEnum(FileConversionFormat)
  outputFormat: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  quality?: number;
}
