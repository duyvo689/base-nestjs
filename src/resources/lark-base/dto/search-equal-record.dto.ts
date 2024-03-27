import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class SearchEqualRecordDto {
  @IsString()
  @IsNotEmpty()
  appToken: string;

  @IsString()
  @IsNotEmpty()
  tableId: string;

  @IsObject()
  @IsNotEmptyObject()
  filters: {
    fieldName: string;
    value: string;
  };

  @IsString()
  @IsOptional()
  nameBoxApp?: string;
}

//Ví dụ filters DTO
// {
//     fieldName:string,
//     value: string
// }

//Ví dụ data call api
// {
//     "filter": {
//       "conjunction": "and",s
//       "conditions": [
//         {
//           "field_name": "Order ID",
//           "operator": "is",
//           "value": [
//             "538-898-642-116"
//           ]
//         }
//       ]
//     },
//     "automatic_fields": false
// }
