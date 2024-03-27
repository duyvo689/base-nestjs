import { IsNotEmpty, IsNotEmptyObject, IsObject, IsString } from "class-validator";


export class GetTenantAccessTokenDto {
    @IsString()
    @IsNotEmpty()
    appId: string

    @IsString()
    @IsNotEmpty()
    appSecret: string
}
