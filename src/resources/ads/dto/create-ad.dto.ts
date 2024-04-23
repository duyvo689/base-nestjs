import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAdDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
