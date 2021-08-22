import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { KnexConnectionModule } from './knex-connection/knex-connection.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';

@Module({
  imports: [UsersModule, KnexConnectionModule, AuditLogsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
