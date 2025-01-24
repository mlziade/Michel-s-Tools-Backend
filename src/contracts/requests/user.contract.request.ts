import { IsInt, Max, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserContractRequest {
    @ApiProperty({ description: 'First name of the user', example: 'John' })
    firstName: string;

    @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
    lastName: string;

    @ApiProperty({ description: 'Username of the user', example: 'johndoe' })
    username: string;

    @ApiProperty({ description: 'Password of the user', example: 'password123' })
    password: string;
}

export class UpdateUserContractRequest extends CreateUserContractRequest {
    @ApiProperty({ description: 'First name of the user', example: 'John' })
    firstName: string;

    @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
    lastName: string;
}

export class QueryUserPaginatedDto {
    @ApiProperty({ description: 'The page number', example: 1 })
    @IsInt({ message: 'The page number must be an integer.' })
    @Min(1, { message: 'The page number must be at least 1.' })
    page: number;

    @ApiProperty({ description: 'The limit of items per page', example: 10 })
    @IsInt({ message: 'The limit must be an integer.' })
    @Max(50, { message: 'The limit max value is 50.' })
    limit: number;
}