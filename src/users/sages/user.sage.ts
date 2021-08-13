import { Injectable } from '@nestjs/common';
import { IEvent, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { SentWelcomeMailToUserCommand } from '../commands/impls/sent-welcome-mail-user.command';
import { UserCreatedEvent } from '../events/imlps';
import { map } from 'rxjs/operators';

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
}
