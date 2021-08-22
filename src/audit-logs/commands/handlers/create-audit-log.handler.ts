import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatedResponseDTO } from '../../../common/dto';
import { AuditLogRepository } from '../../audit-log.repository';
import { CreateAuditLogCommand } from '../impls/create-audit-log.command';

@CommandHandler(CreateAuditLogCommand)
export class CreateAuditLogCommandHandler
  implements ICommandHandler<CreateAuditLogCommand>
{
  constructor(private readonly auditLogRepository: AuditLogRepository) {}
  async execute(command: CreateAuditLogCommand): Promise<CreatedResponseDTO> {
    return this.auditLogRepository.create(command.auditLog);
  }
}
