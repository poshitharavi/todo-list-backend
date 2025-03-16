import { Prisma } from '@prisma/client';

export const departments: Prisma.DepartmentCreateInput[] = [
  {
    name: 'Marketing',
  },
  {
    name: 'Finance',
  },
  {
    name: 'IT',
  },
];
