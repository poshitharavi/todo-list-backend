import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateUserDto, LoginUserDto } from './dtos';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { Response } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly userService: UsersService) {}

  @Roles('admin')
  @Post('employee-register')
  @UseGuards(AuthGuard, RolesGuard)
  async registerEmployeeUser(
    @Res() response: Response,
    @Body() createUserDto: CreateUserDto,
  ): Promise<any> {
    try {
      const newUser =
        await this.userService.registerEmployeeUser(createUserDto);

      return response.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Successfully registered',
        body: {
          newUser,
        },
      });
    } catch (error) {
      this.logger.error(`Error at /user/employee-register: ${error.message}`);
      if (error instanceof ConflictException) {
        // Handle UnauthorizedException differently
        return response.status(StatusCodes.CONFLICT).json({
          message: error.message,
          error: getReasonPhrase(StatusCodes.CONFLICT),
          statusCode: StatusCodes.CONFLICT,
        });
      }
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong',
        error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Public()
  @Post('login')
  async loginUser(
    @Res() response: Response,
    @Body() loginUserDto: LoginUserDto,
  ): Promise<any> {
    try {
      const loginRes = await this.userService.loginUser(loginUserDto);

      return response.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Successfully authenticated',
        body: {
          ...loginRes,
        },
      });
    } catch (error) {
      this.logger.error(`Error at /user/login: ${error}`);
      if (error instanceof UnauthorizedException) {
        // Handle UnauthorizedException differently
        return response.status(StatusCodes.UNAUTHORIZED).json({
          message: error.message,
          error: getReasonPhrase(StatusCodes.UNAUTHORIZED),
          statusCode: StatusCodes.UNAUTHORIZED,
        });
      }

      if (error instanceof NotFoundException) {
        // Handle UnauthorizedException differently
        return response.status(StatusCodes.NOT_FOUND).json({
          message: error.message,
          error: getReasonPhrase(StatusCodes.NOT_FOUND),
          statusCode: StatusCodes.NOT_FOUND,
        });
      }
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong',
        error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Roles('admin')
  @Get('employees')
  @UseGuards(AuthGuard, RolesGuard)
  async getAllEmployees(@Res() response: Response): Promise<any> {
    try {
      const employees = await this.userService.getAllEmployees();

      return response.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Successfully retrieved all products',
        body: {
          employees,
        },
      });
    } catch (error) {
      this.logger.error(`Error at /user/employees: ${error.message}`);

      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong',
        error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Roles('admin')
  @Patch('employee/:id')
  @UseGuards(AuthGuard, RolesGuard)
  async updateEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Res() response: Response,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<any> {
    try {
      const updatedEmployee = await this.userService.updateEmployee(
        id,
        updateEmployeeDto,
      );

      return response.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: `Successfully updated employee details of employee id ${updatedEmployee.id}`,
        body: {
          updatedEmployee,
        },
      });
    } catch (error) {
      this.logger.error(`Error at /product/${id}: ${error.message}`);

      if (error instanceof NotFoundException) {
        // Handle UnauthorizedException differently
        return response.status(StatusCodes.NOT_FOUND).json({
          message: error.message,
          error: getReasonPhrase(StatusCodes.NOT_FOUND),
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      if (error instanceof ConflictException) {
        // Handle UnauthorizedException differently
        return response.status(StatusCodes.CONFLICT).json({
          message: error.message,
          error: getReasonPhrase(StatusCodes.CONFLICT),
          statusCode: StatusCodes.CONFLICT,
        });
      }

      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong',
        error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Roles('admin')
  @Get('employee/:id')
  @UseGuards(AuthGuard, RolesGuard)
  async getEmployeeById(
    @Param('id', ParseIntPipe) id: number,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const employee = await this.userService.getEmployeeById(id);

      return response.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: `Successfully employee fetched`,
        body: {
          employee,
        },
      });
    } catch (error) {
      this.logger.error(`Error at /user/employee/${id}: ${error.message}`);

      if (error instanceof NotFoundException) {
        // Handle UnauthorizedException differently
        return response.status(StatusCodes.NOT_FOUND).json({
          message: error.message,
          error: getReasonPhrase(StatusCodes.NOT_FOUND),
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      if (error instanceof ConflictException) {
        // Handle UnauthorizedException differently
        return response.status(StatusCodes.CONFLICT).json({
          message: error.message,
          error: getReasonPhrase(StatusCodes.CONFLICT),
          statusCode: StatusCodes.CONFLICT,
        });
      }

      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong',
        error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Roles('admin')
  @Delete('employee/:id')
  @UseGuards(AuthGuard, RolesGuard)
  async deactivateEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Res() response: Response,
  ): Promise<any> {
    try {
      await this.userService.deactivateEmployee(id);

      return response.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: `Successfully updated employee details of employee id ${id}`,
      });
    } catch (error) {
      this.logger.error(`Error at /product/${id}: ${error.message}`);

      if (error instanceof NotFoundException) {
        // Handle UnauthorizedException differently
        return response.status(StatusCodes.NOT_FOUND).json({
          message: error.message,
          error: getReasonPhrase(StatusCodes.NOT_FOUND),
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      if (error instanceof ConflictException) {
        // Handle UnauthorizedException differently
        return response.status(StatusCodes.CONFLICT).json({
          message: error.message,
          error: getReasonPhrase(StatusCodes.CONFLICT),
          statusCode: StatusCodes.CONFLICT,
        });
      }

      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong',
        error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
