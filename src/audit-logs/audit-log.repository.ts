import { KNEX_CONNECTION } from './../knex-connection/knex-connection.provider';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Knex } from 'knex';
import { CreateAuditLogDTO } from './dto';
import { v4 } from 'uuid';
import { CreatedResponseDTO } from '../common/dto';

/**
 * Repository layer for audit-log operations
 */
@Injectable()
export class AuditLogRepository {
  private readonly _tableName = 'audit-logs';
  private readonly _logger: Logger;

  /**
   * Initialization
   * @param conn initialization of knex connection
   */
  constructor(@Inject(KNEX_CONNECTION) private readonly conn: Knex) {
    this._logger = new Logger('AuditLogRepository');
  }

  /**
   * Method for creating audit log
   * @param auditLog audit-log payload
   * @param conn knex connection
   * @returns
   */
  async create(
    auditLog: CreateAuditLogDTO,
    conn?: Knex,
  ): Promise<CreatedResponseDTO> {
    conn = conn || this.conn;
    const payload: {
      id: string;
      table_name: string;
      table_uuid: string;
      user: string;
      event: string;
      old_data?: unknown;
      new_data?: unknown;
    } = {
      id: v4(),
      table_name: auditLog.tableName,
      table_uuid: auditLog.tableId,
      user: auditLog.user,
      event: auditLog.event,
    };
    if (auditLog.oldData) {
      payload.old_data = auditLog.oldData;
    }
    if (auditLog.newData) {
      payload.new_data = auditLog.newData;
    }
    const [resp] = await conn
      .insert(payload, '*')
      .into(this._tableName)
      .catch((error) => {
        this._logger.error(`Error in create method, error: ${error}`);
        throw new InternalServerErrorException('Failed to create audit-log');
      });
    const { id, created_at }: CreatedResponseDTO = resp;
    return { id, created_at };
  }
}
