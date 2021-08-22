import { CreateAuditLogCommand } from './../../audit-logs/commands/impls/create-audit-log.command';
import { Injectable } from '@nestjs/common';
import { IEvent, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { SentWelcomeMailToUserCommand } from '../commands/impls/sent-welcome-mail-user.command';
import { UserCreatedEvent, UserDeletedEvent } from '../events/imlps';
import { map } from 'rxjs/operators';

/**
 * Sage layer for user operation
 */
@Injectable()
export class UserSagas {
  /**
   * Method for sending welcome mail
   * @param event$
   * @returns
   */
  @Saga()
  sentWelcomeMail = (event$: Observable<IEvent>) => {
    return event$.pipe(
      ofType(UserCreatedEvent),
      map((event) => new SentWelcomeMailToUserCommand(event.userId)),
    );
  };

  /**
   * Method for creating a audit-log when a user is created
   * @param events$
   * @returns
   */
  @Saga()
  userCreatedAuditLog = (events$: Observable<IEvent>) => {
    return events$.pipe(
      ofType(UserCreatedEvent),
      map(
        (event) =>
          new CreateAuditLogCommand({
            user: event.userId,
            tableId: event.userId,
            tableName: 'users',
            event: 'user_created',
          }),
      ),
    );
  };

  /**
   * Method for creating a audio-log when a user is deleted
   * @param event$
   * @returns
   */
  @Saga()
  userDeletedAuditLog = (event$: Observable<IEvent>) => {
    return event$.pipe(
      ofType(UserDeletedEvent),
      map(
        (event) =>
          new CreateAuditLogCommand({
            user: event.by,
            tableId: event.id,
            tableName: 'users',
            event: 'user_deleted',
          }),
      ),
    );
  };
}
