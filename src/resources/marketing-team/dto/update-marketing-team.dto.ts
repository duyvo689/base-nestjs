import { PartialType } from '@nestjs/mapped-types';
import { CreateMarketingTeamDto } from './create-marketing-team.dto';

export class UpdateMarketingTeamDto extends PartialType(CreateMarketingTeamDto) {}
