import { Module } from '@nestjs/common';
import { LarkBaseService } from './lark-base.service';
import { LarkBaseController } from './lark-base.controller';

@Module({
  controllers: [LarkBaseController],
  providers: [LarkBaseService],
  exports: [LarkBaseService],
})
export class LarkBitableModule {}
