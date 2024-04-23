import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  shortName: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsArray()
  @IsNotEmpty()
  permissions: string[];
}
