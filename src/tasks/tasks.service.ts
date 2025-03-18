import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskPriority } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddTaskDto } from './dtos/new-task.dto';
import { TaskAnalytics } from './interfaces';

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
      orderBy: {
        id: 'asc',
      },
    });

    return tasks;
  }

  getPriorityList(): string[] {
    return ['Low', 'Medium', 'High'];
  }

  async getTaskAnalytics(): Promise<TaskAnalytics[]> {
    const tasks = await this.prisma.task.findMany({
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const usersMap = tasks.reduce((acc, task) => {
      const userId = task.assignedToId;
      if (!acc.has(userId)) {
        acc.set(userId, {
          userId,
          userName: `${task.assignedTo.firstName} ${task.assignedTo.lastName} `,
          tasks: [],
        });
      }
      acc.get(userId).tasks.push(task);
      return acc;
    }, new Map<number, { userId: number; userName: string; tasks: typeof tasks }>());

    const analytics: TaskAnalytics[] = Array.from(usersMap.values()).map(
      ({ userId, userName, tasks }) => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((t) => t.isCompleted).length;
        const pendingTasks = totalTasks - completedTasks;
        const expiredTasks = tasks.filter(
          (t) => !t.isCompleted && t.dueDate < new Date(),
        ).length;
        const completionPercentage =
          totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);

        return {
          userId,
          userName,
          totalTasks,
          completedTasks,
          pendingTasks,
          expiredTasks,
          completionPercentage,
        };
      },
    );

    return analytics;
  }

  async updateTaskStatus(id: number): Promise<Task> {
    try {
      const task = await this.prisma.task.findUniqueOrThrow({
        where: {
          id,
        },
      });

      const updatedTask = await this.prisma.task.update({
        where: {
          id,
        },
        data: {
          isCompleted: !task.isCompleted,
        },
      });

      return updatedTask;
    } catch (error) {
      // check if post not found and throw error
      if (error.code === 'P2025') {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      // throw error if any
      throw error;
    }
  }
}
