import { Module } from '@nestjs/common';
import { CancelReasonService } from './cancel-reason.service';
import { CancelReasonController } from './cancel-reason.controller';

@Module({
  controllers: [CancelReasonController],
  providers: [CancelReasonService],
})
export class CancelReasonModule {}
