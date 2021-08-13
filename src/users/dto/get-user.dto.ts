export class UserDataDTO {
  id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  mobile_number: string;
  mobile_code: string;
  keycloakId: string;
  is_active: boolean;
  account_verified: boolean;
  created_at: Date;
  updated_at?: Date;
  created_by?: string;
  updated_by?: string;
  welcome_mail_sent?: boolean;
  data: any;
}
