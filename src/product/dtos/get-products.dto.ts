import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { FindManyDto } from 'src/common';

export class GetAllProductQueryDto extends FindManyDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  categoryId?: string;
}
