import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { active } from '@prisma/client';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
}
