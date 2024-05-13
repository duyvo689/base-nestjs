import { IsArray, isNotEmptyObject, IsObject } from 'class-validator';

export class CreateOrderDto {
  @IsObject()
  order: any;

  @IsArray()
  orderItems: any[];
}
