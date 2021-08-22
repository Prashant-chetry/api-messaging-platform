import { IsIn, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

export enum AuditLogEventEnum {
  USER_CREATED = 'user_created',
  USER_UPDATED = 'user_updated',
  USER_DELETED = 'user_deleted',
}

export class CreateAuditLogDTO {
  @IsUUID('all', { message: 'Please enter a valid id' })
  tableId: string;

  @IsUUID('all', { message: 'Please enter a valid user' })
  user: string;

  @IsString()
  tableName: string;

  @IsOptional()
  @IsObject({ message: 'Please enter a valid old data' })
  oldData?: any;

  @IsOptional()
  @IsObject({ message: 'Please enter a valid new data' })
  newData?: any;

  @IsString()
  @IsIn([
    AuditLogEventEnum.USER_CREATED,
    AuditLogEventEnum.USER_UPDATED,
    AuditLogEventEnum.USER_DELETED,
  ])
  event: string;
}
