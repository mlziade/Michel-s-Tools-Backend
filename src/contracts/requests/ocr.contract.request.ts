import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export enum FileOcrFormat {
  jpeg = 'image/jpeg',
  png = 'image/png',
}
