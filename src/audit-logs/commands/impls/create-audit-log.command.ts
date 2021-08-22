import { ICommand } from '@nestjs/cqrs';
import { CreateAuditLogDTO } from '../../dto';

export class CreateAuditLogCommand implements ICommand {
  constructor(public readonly auditLog: CreateAuditLogDTO) {}
}
