import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MobileWithCode {
  @ApiProperty()
  @IsString({ message: 'Please enter a valid mobile number' })
  @IsNotEmpty({ message: 'Please enter a valid mobile number' })
  number: string;

  @ApiProperty()
  @IsString({ message: 'Please enter a valid mobile code' })
  @IsNotEmpty({ message: 'Please enter a valid mobile code' })
  code: string;
}
