import { Controller, Get, Post, Put, Delete, UseGuards, Body, Param, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserContractRequest, QueryUserPaginatedDto, UpdateUserContractRequest } from 'src/contracts/requests/user.contract.request';
import { UserResponseDto } from 'src/contracts/response/user.contract.response';
import { User } from 'src/entities/user.entity';
import { ApiKeyGuard } from 'src/guards/apikey.guard';
import { UserService } from 'src/services/user.service';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}
    
    @Get()
    async findAll(): Promise<UserResponseDto[]> {
        const users: User[] = await this.userService.findAll();
        return users.map(user => UserResponseDto.fromUser(user));
    }

    @Get('paginated')
    async findPaginated(
        @Query('query') query: QueryUserPaginatedDto,
    ): Promise<UserResponseDto[]> {	
        const users: User[] = await this.userService.findPaginated(query);
        return users.map(user => UserResponseDto.fromUser(user));
    }

    @Get(':id')
    async findById(@Param('id') id: number): Promise<UserResponseDto> {
        const existingUser: User = await this.userService.findById(id);
        return UserResponseDto.fromUser(existingUser);
    }

    @Get(':username')    
    async findByUsername(@Param('username') username: string): Promise<UserResponseDto> {
        const existingUser: User = await this.userService.findByUsername(username);
        return UserResponseDto.fromUser(existingUser);
    }

    @Post()
    async create(@Body() user: CreateUserContractRequest): Promise<UserResponseDto> {
        const newUser: User = await this.userService.create(user);
        return UserResponseDto.fromUser(newUser);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateDto: UpdateUserContractRequest): Promise<UserResponseDto> {
        const updatedUser: User = await this.userService.update(id, updateDto);
        return UserResponseDto.fromUser(updatedUser);
    }

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<UserResponseDto> {
        const deletedUser: User = await this.userService.remove(id);
        return UserResponseDto.fromUser(deletedUser);
    }
}