import { IsInt, Max, Min } from 'class-validator';

export class QueryUserPaginatedDto {
    @IsInt({ message: 'The page number must be an integer.' })
    @Min(1, { message: 'The page number must be at least 1.' })
    page: number;

    @IsInt({ message: 'The limit must be an integer.' })
    @Max(50, { message: 'The limit max value is 50.' })
    limit: number;
}
