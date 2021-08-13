import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @IsEmail({}, { message: 'Please enter a valid mail' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Please enter a valid first name' })
  @MaxLength(100, { message: 'Please enter a valid first name' })
  first_name?: string;

  @IsOptional()
  @IsString({ message: 'Please enter a valid last name' })
  @MaxLength(100, { message: 'Please enter a valid last name' })
  last_name?: string;

  @IsOptional()
  @IsString({ message: 'Please enter a valid middle name' })
  @MaxLength(100, { message: 'Please enter a valid middle name' })
  middle_name?: string;

  @IsOptional()
  @IsBoolean({ message: 'Please select a valid is-active value' })
  is_active?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Please enter a valid account-verification value' })
  account_verified?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Please enter a valid welcome-mail-sent value' })
  welcome_mail_sent?: boolean;

  @IsOptional()
  @IsString({ message: 'Please enter a valid mobile number' })
  @MaxLength(10, { message: 'Please enter a valid mobile number' })
  mobile_number?: string;

  @IsOptional()
  @IsString({ message: 'Please select a valid mobile code' })
  @MaxLength(5, { message: 'Please select a valid mobile code' })
  mobile_code?: string;
}
