import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { KnexConnectionModule } from 'src/knex-connection/knex-connection.module';
import { AuditLogRepository } from './audit-log.repository';
import { AuditLogCommandHandlers } from './commands/handlers';

@Module({
  imports: [CqrsModule, KnexConnectionModule],
  providers: [AuditLogRepository, ...AuditLogCommandHandlers],
  exports: [AuditLogRepository, ...AuditLogCommandHandlers],
})
export class AuditLogsModule {}
