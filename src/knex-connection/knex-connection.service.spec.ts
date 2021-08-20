import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { KnexConnectionService } from './knex-connection.service';

describe('KnexConnectionService', () => {
  let service: KnexConnectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [() => ({ DB_ENV: '' })] })],
      providers: [KnexConnectionService],
    }).compile();

    service = module.get<KnexConnectionService>(KnexConnectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
