import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AddTaskDto } from './dtos/new-task.dto';
import { Response } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('tasks')
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(private readonly tasksService: TasksService) {}

  @Roles('admin')
  @Post('new')
  @UseGuards(AuthGuard, RolesGuard)
  async addNewTask(
    @Req() request: any,
    @Res() response: Response,
    @Body() addTaskDto: AddTaskDto,
  ): Promise<any> {
    try {
      const { user } = request;
      const newTask = await this.tasksService.addNewTask(addTaskDto, user.sub);

      return response.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Successfully new task assigned',
        body: {
          newTask,
        },
      });
    } catch (error) {
      this.logger.error(`Error at /tasks/new : ${error.message}`);

      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong',
        error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Roles('employee')
  @Get('my')
  @UseGuards(AuthGuard, RolesGuard)
  async getAssignedTasks(
    @Req() request: any,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const { user } = request;

      const tasks = await this.tasksService.getAssignedTasks(user.sub);

      return response.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Successfully retrieved all tasks',
        body: {
          tasks,
        },
      });
    } catch (error) {
      this.logger.error(`Error at /task/my: ${error.message}`);

      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong',
        error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Public()
  @Get('priority-list')
  @UseGuards(AuthGuard)
  async getPriorityList(@Res() response: Response): Promise<any> {
    try {
      const priorityList = this.tasksService.getPriorityList();

      return response.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Successfully retrieved priority list',
        body: {
          priorityList,
        },
      });
    } catch (error) {
      this.logger.error(`Error at /task/priority-list: ${error.message}`);

      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong',
        error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Roles('admin')
  @Get('analytics')
  @UseGuards(AuthGuard, RolesGuard)
  async getTaskAnalytics(@Res() response: Response): Promise<any> {
    try {
      const analytics = await this.tasksService.getTaskAnalytics();

      return response.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Successfully calculated the task analytics',
        body: {
          analytics,
        },
      });
    } catch (error) {
      this.logger.error(`Error at /task/analytics : ${error.message}`);

      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong',
        error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
