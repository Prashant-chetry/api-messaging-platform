export const configuration = () => ({
  DATABASE_NAME: process.env.DATABASE_NAME,
  DATABASE_USER: process.env.DATABASE_USER,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  KEYCLOAK_HOST: process.env.KEYCLOAK_HOST,
  KEYCLOAK_MASTER_REALM_USERNAME: process.env.KEYCLOAK_MASTER_REALM_USERNAME,
  KEYCLOAK_MASTER_REALM_PASSWORD: process.env.KEYCLOAK_MASTER_REALM_PASSWORD,
  KEYCLOAK_REALM_NAME: process.env.KEYCLOAK_REALM_NAME,
});
