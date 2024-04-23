import { Injectable } from '@nestjs/common';
import { CreateMarketingTeamDto } from './dto/create-marketing-team.dto';
import { UpdateMarketingTeamDto } from './dto/update-marketing-team.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MarketingTeamService {
  constructor(private readonly prismaService: PrismaService) {}

  
  async create(createMarketingTeamDto: CreateMarketingTeamDto) {
    const marketingTeam = await this.prismaService.marketingTeams.create({
      data: createMarketingTeamDto,
    });
    return marketingTeam;
  }

  async findAll() {
    const marketingTeam = await this.prismaService.marketingTeams.findMany({
      where: {
        active: 'ACTIVE',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return marketingTeam;
  }

  async remove(id: string) {
    await this.prismaService.marketingTeams.update({
      where: {
        id: id,
      },
      data: {
        active: 'DELETE',
      },
    });
    return `This action removes a #${id} ads`;
  }
}
