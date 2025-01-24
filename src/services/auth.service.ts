import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { UserService } from './user.service';
import { LoginResponseDto } from 'src/contracts/response/auth.contract.response';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    /* 
    * This method is used to validate a user's credentials
    * It takes a username and password as arguments and returns the user object if the credentials are valid
    */
    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findByUsername(username);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        } else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    /* 
    * This method is used to generate a JWT token for a user
    * It takes a user object as an argument and returns an object containing the access
    */
    async login(user: User): Promise<LoginResponseDto> {
        const payload = { 
            username: user.username, 
            sub: user.id 
        };
        return {
            access_token: this.jwtService.sign(payload),
            expires_in: 3600,
        } as LoginResponseDto;
    }
}
