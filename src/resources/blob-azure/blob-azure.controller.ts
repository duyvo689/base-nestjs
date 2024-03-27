import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Header,
  Res,
  Query,
} from '@nestjs/common';
import { BlobAzureService } from './blob-azure.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('blob-azure')
export class BlobAzureController {
  constructor(private readonly blobAzureService: BlobAzureService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('myfile'))
  upload(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string; name: string }> {
    return this.blobAzureService.upload(file);
  }
  @Post('upload-video-for-antd')
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideoForAtnd(
    @UploadedFile() video: Express.Multer.File,
  ): Promise<string> {
    return (await this.blobAzureService.upload(video))?.url;
  }

  @Get('read-image')
  @Header('Content-Type', 'image/webp')
  async readImage(@Res() res, @Query('filename') filename) {
    const file = await this.blobAzureService.getfileStream(filename);
    return file.pipe(res);
  }

  @Get('delete-image')
  async delete(@Query('filename') filename) {
    await this.blobAzureService.delete(filename);
    return 'deleted';
  }
}
