import { serviceTag } from '@prisma/client';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  customId: string;


  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsEnum(serviceTag)
  @IsNotEmpty()
  serviceTag: serviceTag;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsNumber()
  @IsNotEmpty()
  priceFrom: number;


  @IsNumber()
  @IsNotEmpty()
  priceTo: number;

  @IsArray()
  @IsOptional()
  clinicIds?:string[]

  @IsString()
  @IsOptional()
  description?:string
}
