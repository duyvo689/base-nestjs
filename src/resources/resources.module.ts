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
import { OrderModule } from './order/order.module';
import { ServiceModule } from './service/service.module';
import { CouponModule } from './coupon/coupon.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [UserModule, StaffModule, LogModule, RoleModule, ClinicModule,BlobAzureModule, AdsModule, MarketingTeamModule, RankModule, OrderModule, ServiceModule, CouponModule, CategoryModule],
})
export class ResourcesModule {}
