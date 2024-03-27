import { BadRequestException, Injectable } from '@nestjs/common';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BlobAzureService {
  constructor(private configService: ConfigService) {}

  getBlobClient(imageName: string): BlockBlobClient {
    const blobClientService = BlobServiceClient.fromConnectionString(
      this.configService.get('BLOB_AZURE_CONNECTION_STRING'),
    );
    const containerClient = blobClientService.getContainerClient(
      this.configService.get('BLOB_CONTAINER_NAME'),
    );
    const x = Math.floor(Math.random() * 1000 + 1);
    const newName = `azure${x}_${imageName}`;
    const blobClient = containerClient.getBlockBlobClient(newName);
    return blobClient;
  }

  async upload(file: Express.Multer.File) {
    if (!file) throw new BadRequestException();
    const blobClient = this.getBlobClient(file.originalname);
    await blobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });
    return {
      url: blobClient.url,
      name: blobClient.name,
    };
  }

  async getfileStream(fileName: string) {
    const blobClient = this.getBlobClient(fileName);
    var blobDownloaded = await blobClient.download();
    return blobDownloaded.readableStreamBody;
  }

  async delete(filename: string) {
    const blobClient = this.getBlobClient(filename);
    await blobClient.deleteIfExists();
  }
}
