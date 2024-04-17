import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class LogService {
  constructor(private readonly prismaService: PrismaService) {}

  async createLog(createLogDto: CreateLogDto, staff: any) {
    await this.prismaService.functionLogs.create({
      data: {
        ...createLogDto,
        staffId: staff.sub,
        staffName: staff.name,
      },
    });
    return 'done';
  }
}
