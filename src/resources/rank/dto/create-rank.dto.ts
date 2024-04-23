import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateRankDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  expenseAmount: number;

  @IsNumber()
  @IsNotEmpty()
  convertPoints: number;

  @IsNumber()
  @IsNotEmpty()
  minPoints: number;

  @IsNumber()
  @IsNotEmpty()
  maxPoints: number;

  // optional
  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  hexColor: string;
}
