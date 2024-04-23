import { Injectable } from '@nestjs/common';
import { CreateRankDto } from './dto/create-rank.dto';
import { UpdateRankDto } from './dto/update-rank.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RankService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRankDto: CreateRankDto) {
    const rank = await this.prismaService.ranks.create({
      data: createRankDto,
    });
    return rank;
  }

  async findAll() {
    const ranks = await this.prismaService.ranks.findMany({
      where: { active: 'ACTIVE' },
    });
    return ranks;
  }

  async remove(id: string) {
    const rank = await this.prismaService.ranks.update({
      where: { id: id },
      data: {
        active: 'DELETE',
      },
    });
    return rank;
  }
}
