import { IsArray, IsObject } from 'class-validator';

export class CreatePaymentDto {
  @IsObject()
  bill: any;

  @IsArray()
  billItems: any;
}
