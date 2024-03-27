import { Module } from '@nestjs/common';
import { StaffModule } from './staff/staff.module';
import { UserModule } from './user/user.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [UserModule, StaffModule, LogModule],
})
export class ResourcesModule {}
