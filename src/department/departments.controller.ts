import { Controller, Get, Logger, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { DepartmentsService } from './departments.service';

@Controller('departments')
export class DepartmentsController {
  private readonly logger = new Logger(DepartmentsController.name);

  constructor(private readonly departmentsService: DepartmentsService) {}

  @Roles('admin')
  @Get('all')
  @UseGuards(AuthGuard, RolesGuard)
  async getAllDepartments(@Res() response: Response): Promise<any> {
    try {
      const departments = await this.departmentsService.getAllDepartments();

      return response.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Successfully retrieved all products',
        body: {
          departments,
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
}
