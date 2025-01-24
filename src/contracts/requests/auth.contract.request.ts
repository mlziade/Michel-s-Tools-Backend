import { ApiProperty } from '@nestjs/swagger';

export class LoginContractDto {
    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;
}