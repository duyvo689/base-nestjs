import { bookingType } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsAlpha,
  IsArray,
  IsEnum,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  clinicId: string;

  @IsEnum(bookingType)
  @IsNotEmpty()
  bookingType: bookingType;

  @IsString()
  @IsNotEmpty()
  userCustomId: string;

  @IsString()
  @IsNotEmpty()
  appointmentDate: string;

  @IsString()
  @IsOptional()
  sellerOnlineId?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsOptional()
  serviceIds?: string[];
}
