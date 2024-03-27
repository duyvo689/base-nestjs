import { IsNotEmpty, IsString } from 'class-validator';

export class ReadlogDto {
  @IsString()
  @IsNotEmpty()
  recordId: string;

  @IsString()
  @IsNotEmpty()
  staffId: string;

  @IsString()
  @IsNotEmpty()
  staffName: string;
}
