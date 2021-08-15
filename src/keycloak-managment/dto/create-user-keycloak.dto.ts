import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateKeycloakUserDTO {
  @ApiProperty()
  @IsEmail({}, { message: 'Please enter a valid user name' })
  username: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Please enter a valid name' })
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Please enter a valid name' })
  lastName?: string;

  @ApiProperty()
  @IsString({ message: 'Please enter a valid password' })
  password: string;

  @ApiProperty()
  @IsBoolean()
  temporary: boolean;
}
