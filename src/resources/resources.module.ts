import { Module } from '@nestjs/common';
import { StaffModule } from './staff/staff.module';
import { UserModule } from './user/user.module';
import { LogModule } from './log/log.module';
import { RoleModule } from './role/role.module';
import { ClinicModule } from './clinic/clinic.module';
import { BlobAzureModule } from './blob-azure/blob-azure.module';
import { AdsModule } from './ads/ads.module';
import { MarketingTeamModule } from './marketing-team/marketing-team.module';
import { RankModule } from './rank/rank.module';

@Module({
  imports: [UserModule, StaffModule, LogModule, RoleModule, ClinicModule,BlobAzureModule, AdsModule, MarketingTeamModule, RankModule],
})
export class ResourcesModule {}
