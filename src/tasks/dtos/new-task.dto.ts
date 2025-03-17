import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddTaskDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsString()
  dueDate: string;
  @IsNotEmpty()
  @IsNumber()
  assignedToId: number;
  @IsNotEmpty()
  @IsString()
  priority: string;
}
