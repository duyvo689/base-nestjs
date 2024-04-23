import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMarketingTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
