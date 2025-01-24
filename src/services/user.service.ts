import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserContractRequest } from 'src/contracts/requests/user.contract.request';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findById(id: number): Promise<User> {
        const existingUser: User | null = await this.userRepository.findOne({ where: { id } });
        if (!existingUser) {
            throw new NotFoundException('User not found');
        }

        return existingUser;
    }

    async findByUsername(username: string): Promise<User> {
        const existingUser: User | null = await this.userRepository.findOne({ where: { username } });
        if (!existingUser) {
            throw new NotFoundException('User not found');
        }

        return existingUser;
    }

    async findAll(): Promise<User[]> {
        const users: User[] = await this.userRepository.find();
        return users;
    }

    async findPaginated(query: { page: number, limit: number }): Promise<User[]> {
        const users: User[] = await this.userRepository.find({
            skip: (query.page - 1) * query.limit,
            take: query.limit,
        });

        return users;
    }

    async create(createDto: CreateUserContractRequest): Promise<User> {
        const existingUser: User | null = await this.userRepository.findOne({ where: { username: createDto.username } });
        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const hashedPassword = await this.hashPassword(createDto.password);

        const date = new Date();
        const newUser: User = await this.userRepository.save({
            ...createDto,
            isActive: true,
            createdAd: date,
            updatedAd: date,
            password: hashedPassword,
        } as User);

        return newUser;
    }

    async update(id: number, updateDto: CreateUserContractRequest): Promise<User> {
        const existingUser: User | null = await this.userRepository.findOne({ where: { id } });
        if (!existingUser) {
            throw new NotFoundException('User not found');
        }

        const date = new Date();
        const updatedUser: User = await this.userRepository.save({
            ...updateDto,
            updatedAd: date,
        } as User);

        return updatedUser;
    }

    async remove(id: number): Promise<User> {
        const existingUser: User | null = await this.userRepository.findOne({ where: { id } });
        if (!existingUser) {
            throw new NotFoundException('User not found');
        }

        await this.userRepository.delete(id);

        return existingUser;
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
      }
}