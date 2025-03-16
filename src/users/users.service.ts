import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from './dtos';
import { compare, hash } from 'bcrypt';
import { User } from '@prisma/client';
import { LoginResponse, UserPayload } from './interfaces';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerEmployeeUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newAdmin = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: await hash(createUserDto.password, 10),
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          departmentId: createUserDto.departmentId,
          role: 'employee',
        },
      });

      delete newAdmin.password;

      return newAdmin;
    } catch (error) {
      // check if email already registered and throw error
      if (error.code === 'P2002') {
        throw new ConflictException('Email already registered');
      }

      // throw error if any
      throw error;
    }
  }

  async loginAdmin(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: loginUserDto.email },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!(await compare(loginUserDto.password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload: UserPayload = {
        sub: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      };

      return {
        name: payload.name,
        email: payload.email,
        token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw error;
    }
  }
}
