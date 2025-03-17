import { Injectable } from '@nestjs/common';

import { Department } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async getAllDepartments(): Promise<Department[]> {
    const departments = await this.prisma.department.findMany();

    return departments;
  }
}
