import { Injectable } from '@nestjs/common';
import { Task, TaskPriority } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddTaskDto } from './dtos/new-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async addNewTask(addTaskDto: AddTaskDto, adminId: number): Promise<Task> {
    try {
      const newTask = await this.prisma.task.create({
        data: {
          name: addTaskDto.name,
          description: addTaskDto.description,
          dueDate: addTaskDto.dueDate,
          createdById: adminId,
          assignedToId: addTaskDto.assignedToId,
          priority: addTaskDto.priority as TaskPriority,
        },
      });

      return newTask;
    } catch (error) {
      throw error;
    }
  }

  async getAssignedTasks(id: number): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        assignedToId: id,
      },
    });

    return tasks;
  }

  getPriorityList(): string[] {
    return ['Low', 'Medium', 'High'];
  }
}
