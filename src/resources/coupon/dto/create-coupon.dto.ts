import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDate()
  @IsNotEmpty()
  fromDate: Date;

  @IsDate()
  @IsNotEmpty()
  toDate: Date;

  @IsNumber()
  @IsNotEmpty()
  issueQuantity: number;

  @IsNumber()
  @IsNotEmpty()
  numberOfUses: number;

  @IsArray()
  @IsOptional()
  couponApplyAtClinic: string[];

  @IsArray()
  @IsOptional()
  couponApplyServices: {
    serviceId: string;
    cash: number;
    percent: number;
  }[];
}
