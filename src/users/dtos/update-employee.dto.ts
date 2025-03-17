import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @IsNotEmpty()
  @IsString()
  lastName: string;
  @IsNotEmpty()
  @IsNumber()
  departmentId: number;
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
