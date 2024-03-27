import { IsNotEmpty, IsNotEmptyObject, IsObject, IsOptional, IsString } from "class-validator";


export class UpdateRecordDto {
    @IsString()
    @IsNotEmpty()
    appToken: string

    @IsString()
    @IsNotEmpty()
    tableId: string

    @IsObject()
    @IsNotEmptyObject()
    filters: {
      fieldName: string;
      value: string;
    };

    @IsObject()
    @IsNotEmptyObject()
    fieldsUpdate: object
  
    @IsString()
    @IsOptional()
    nameBoxApp:string
}
