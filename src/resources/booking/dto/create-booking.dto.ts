import { IsString, IsNotEmpty, IsOptional, IsAlpha, IsArray } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  userId: string;


  @IsString()
  @IsNotEmpty()
  userCustomId: string;

  @IsString()
  @IsNotEmpty()
  appointmentDate: string;

  @IsString()
  @IsNotEmpty()
  creatorId: string;

  @IsString()
  @IsOptional()
  onlineConsultantId?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsOptional()
  serviceIds?: string[];
}
