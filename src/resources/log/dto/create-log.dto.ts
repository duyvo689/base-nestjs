import { actionFunctionLog, functionNameLog } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateLogDto {
    @IsString()
    @IsNotEmpty()
    recordId: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(actionFunctionLog)
    @IsNotEmpty()
    action: actionFunctionLog;


    @IsEnum(functionNameLog)
    @IsNotEmpty()
    functionName: functionNameLog;
    
}
