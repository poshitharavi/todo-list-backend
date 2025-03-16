import {
  Body,
  ConflictException,
  Controller,
  Logger,
  NotFoundException,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateUserDto, LoginUserDto } from './dtos';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly userService: UsersService) {}

  @Post('employee-register')
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
      this.logger.error(`Error at /user/register: ${error.message}`);
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
}
