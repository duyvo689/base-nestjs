import { Module } from '@nestjs/common';
import { BlobAzureService } from './blob-azure.service';
import { BlobAzureController } from './blob-azure.controller';

@Module({
  controllers: [BlobAzureController],
  providers: [BlobAzureService],
  exports: [BlobAzureService],

})
export class BlobAzureModule {}
