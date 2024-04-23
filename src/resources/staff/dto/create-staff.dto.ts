import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateStaffDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  customId: string;

  @IsDate()
  @IsNotEmpty()
  birthday: Date;

  @IsString()
  @IsNotEmpty()
  roleId: string;

  @IsArray()
  @IsNotEmpty()
  clinicIds: string[];

  //optional
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone2?: string;
}
