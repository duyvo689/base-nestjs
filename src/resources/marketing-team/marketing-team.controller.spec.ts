import { Test, TestingModule } from '@nestjs/testing';
import { MarketingTeamController } from './marketing-team.controller';
import { MarketingTeamService } from './marketing-team.service';

describe('MarketingTeamController', () => {
  let controller: MarketingTeamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketingTeamController],
      providers: [MarketingTeamService],
    }).compile();

    controller = module.get<MarketingTeamController>(MarketingTeamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
