import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Patch(':id')
  update(@Param('id') roleId: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(roleId, updateRoleDto);
  }

  @Delete(':id')
  delete(@Param('id') roleId: string) {
    return this.roleService.delete(roleId);
  }
}
