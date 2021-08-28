import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  ValidateNested,
} from 'class-validator';
import { MobileWithCode } from '../../common/dto/index';

export class CreateUserDTO {
  @ApiProperty()
  @IsString({ message: 'Please enter a valid name' })
  @IsNotEmpty({ message: 'Please enter a valid name' })
  firstName: string;

  @ApiProperty()
  @IsString({ message: 'Please enter a valid name' })
  @IsNotEmpty({ message: 'Please enter a valid name' })
  lastName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Please enter a valid name' })
  middleName?: string;

  @ApiPropertyOptional({ type: MobileWithCode })
  @IsOptional()
  @ValidateNested()
  mobile?: MobileWithCode;

  @ApiProperty()
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;
}
