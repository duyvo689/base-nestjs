import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  clinicId: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  discount: number;

  @IsString()
  @IsOptional()
  sellerOfflineId: string;

  @IsString()
  @IsOptional()
  sellerOnlineId: string;

  @IsString()
  @IsOptional()
  salesSupportId: string;

  @IsString()
  @IsOptional()
  serviceId: string;

  @IsString()
  @IsOptional()
  comboId: string;

  @IsString()
  @IsOptional()
  notes: string;

//   @IsString()
//   @IsOptional()
//   couponId: string;

//   @IsString()
//   @IsOptional()
//   couponStaffId: string;
}
