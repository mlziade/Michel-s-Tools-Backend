import { Controller, Get, Post, Put, Delete, UseGuards, Body, Param, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserContractRequest, QueryUserPaginatedDto, UpdateUserContractRequest } from 'src/contracts/requests/user.contract.request';
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
    async findAll() {
        const users: User[] = await this.userService.findAll();
        return users;
    }

    @Get('paginated')
    async findPaginated(
        @Query('query') query: QueryUserPaginatedDto,
    ): Promise<User[]> {	
        const users: User[] = await this.userService.findPaginated(query);
        return users;
    }

    @Get(':id')
    async findById(@Param('id') id: number): Promise<User> {
        const existingUser: User = await this.userService.findById(id);
        return existingUser;
    }

    @Get(':username')    
    async findByUsername(@Param('username') username: string): Promise<User> {
        const existingUser: User = await this.userService.findByUsername(username);
        return existingUser;
    }

    @Post()
    async create(@Body() user: CreateUserContractRequest): Promise<User> {
        const newUser: User = await this.userService.create(user);
        return newUser;
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateDto: UpdateUserContractRequest): Promise<User> {
        const updatedUser: User = await this.userService.update(id, updateDto);
        return updatedUser;
    }

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<User> {
        const deletedUser: User = await this.userService.remove(id);
        return deletedUser;
    }
}