import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from 'src/configuration';
import { KeycloakRealmService } from './keycloak-realm.service';
import { KeycloakUserService } from './keycloak-user.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [KeycloakUserService, KeycloakRealmService],
  exports: [KeycloakUserService, KeycloakRealmService],
})
export class KeycloakManagementModule {}
