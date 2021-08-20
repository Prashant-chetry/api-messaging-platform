import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { MobileWithCode } from '../../common/dto/index';

export class CreateUserDTO {
  @IsString({ message: 'Please enter a valid name' })
  @IsNotEmpty({ message: 'Please enter a valid name' })
  // @ApiProperty()
  firstName: string;

  // @ApiProperty()
  @IsString({ message: 'Please enter a valid name' })
  @IsNotEmpty({ message: 'Please enter a valid name' })
  lastName: string;

  // @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Please enter a valid name' })
  middleName?: string;

  // @ApiPropertyOptional({ type: MobileWithCode })
  @IsOptional()
  mobile?: MobileWithCode;

  // @ApiProperty()
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;
}
