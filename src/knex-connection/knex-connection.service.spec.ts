import { Test, TestingModule } from '@nestjs/testing';
import { KnexConnectionService } from './knex-connection.service';

describe('KnexConnectionService', () => {
  let service: KnexConnectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KnexConnectionService],
    }).compile();

    service = module.get<KnexConnectionService>(KnexConnectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
