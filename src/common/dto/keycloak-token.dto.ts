export class KeycloakTokenDecoded {
  exp: number;
  iat: number;
  auth_time: number;
  jit: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  nonce: string;
  session_state: string;
  acr: string;
  'allowed-origins': string[];
  realm_access: { roles: string[] };
  resource_access: { account: { role: [] } };
  scope: string;
  email_verified: false;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}
