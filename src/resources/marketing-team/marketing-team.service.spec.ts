import { Test, TestingModule } from '@nestjs/testing';
import { MarketingTeamService } from './marketing-team.service';

describe('MarketingTeamService', () => {
  let service: MarketingTeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketingTeamService],
    }).compile();

    service = module.get<MarketingTeamService>(MarketingTeamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
