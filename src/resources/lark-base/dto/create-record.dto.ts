import { IsNotEmpty, IsNotEmptyObject, IsObject, IsOptional, IsString } from "class-validator";


export class CreateRecordDto {
    @IsString()
    @IsNotEmpty()
    appToken: string

    @IsString()
    @IsNotEmpty()
    tableId: string

    @IsObject()
    @IsNotEmptyObject()
    fields: object

    @IsString()
    @IsOptional()
    nameBoxApp:string
}
