import { IsInt, Max, Min } from 'class-validator';
import { User } from 'src/entities/user.entity';

export class UserResponseDto {
    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
    }

    id: number;
    firstName: string;
    lastName: string;
    username: string;

    static fromUser(user: User): UserResponseDto {
        return new UserResponseDto({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
        })
    }
}

export class ReducedUserResponseDto {
    constructor(partial: Partial<ReducedUserResponseDto>) {
        Object.assign(this, partial);
    }

    id: number;
    username: string;
}