import { Controller, Get, Post, Put, Delete, UseGuards, Body, Param, Query } from '@nestjs/common';
import { CreateUserContractRequest, UpdateUserContractRequest } from 'src/contracts/requests/user.contract.request';
import { QueryUserPaginatedDto } from 'src/contracts/response/user.contract.response';
import { User } from 'src/entities/user.entity';
import { ApiKeyGuard } from 'src/guards/apikey.guard';
import { UserService } from 'src/services/user.service';

@Controller('user')
@UseGuards(ApiKeyGuard)
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}
    
    @Get()
    async findAll() {
        const users: User[] = await this.userService.findAll();
        return users;
    }

    async findPaginated(
        @Query('query') query: QueryUserPaginatedDto,
    ): Promise<User[]> {	
        const users: User[] = await this.userService.findPaginated(query);
        return users;
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<User> {
        const existingUser: User = await this.userService.findOne(id);
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