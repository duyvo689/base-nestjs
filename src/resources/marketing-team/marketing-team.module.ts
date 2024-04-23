import { Module } from '@nestjs/common';
import { MarketingTeamService } from './marketing-team.service';
import { MarketingTeamController } from './marketing-team.controller';

@Module({
  controllers: [MarketingTeamController],
  providers: [MarketingTeamService],
})
export class MarketingTeamModule {}
