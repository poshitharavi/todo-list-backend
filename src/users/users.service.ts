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
import { AllEmployeeResponse, LoginResponse, UserPayload } from './interfaces';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerEmployeeUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newEmployee = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: await hash(createUserDto.password, 10),
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          departmentId: createUserDto.departmentId,
          role: 'employee',
        },
      });

      delete newEmployee.password;

      return newEmployee;
    } catch (error) {
      // check if email already registered and throw error
      if (error.code === 'P2002') {
        throw new ConflictException('Email already registered');
      }

      // throw error if any
      throw error;
    }
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<LoginResponse> {
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
        role: user.role,
      };

      return {
        name: payload.name,
        email: payload.email,
        role: payload.role,
        token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllEmployees(): Promise<AllEmployeeResponse[]> {
    const employees = await this.prisma.user.findMany({
      where: {
        role: 'employee',
        active: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        department: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return employees;
  }

  async getEmployeeById(id: number): Promise<AllEmployeeResponse> {
    try {
      const employee = await this.prisma.user.findUniqueOrThrow({
        where: {
          role: 'employee',
          active: true,
          id,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          department: true,
        },
      });

      return employee;
    } catch (error) {
      // check if post not found and throw error
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      // throw error if any
      throw error;
    }
  }

  async updateEmployee(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<User> {
    try {
      await this.prisma.user.findUniqueOrThrow({
        where: {
          id,
          role: 'employee',
          active: true,
        },
      });

      const updatedEmployee = await this.prisma.user.update({
        where: {
          id,
          role: 'employee',
          active: true,
        },
        data: {
          ...updateEmployeeDto,
        },
      });

      return updatedEmployee;
    } catch (error) {
      // check if post not found and throw error
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      // check if email already registered and throw error
      if (error.code === 'P2002') {
        throw new ConflictException('Email already registered');
      }

      // throw error if any
      throw error;
    }
  }

  async deactivateEmployee(id: number): Promise<boolean> {
    try {
      await this.prisma.user.findUniqueOrThrow({
        where: {
          id,
          role: 'employee',
          active: true,
        },
      });

      await this.prisma.user.update({
        where: {
          id,
          role: 'employee',
          active: true,
        },
        data: {
          active: false,
        },
      });

      return true;
    } catch (error) {
      // check if post not found and throw error
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      // check if email already registered and throw error
      if (error.code === 'P2002') {
        throw new ConflictException('Email already registered');
      }

      // throw error if any
      throw error;
    }
  }
}
