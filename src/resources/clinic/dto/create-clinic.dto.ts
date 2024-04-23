import { IsString, IsNotEmpty } from 'class-validator';

export class CreateClinicDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  shortName: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
