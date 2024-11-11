import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from "@nestjs/common";

import { CreateRoleDto, UpdateRoleDto } from "../dtos/role.dto";
import { RoleService } from "../services/role.service";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/authentication/guards/jwt-auth.guard";
import { Roles } from "src/authorization/decorators/role.decorator";


@ApiTags("Roles")
@Roles('admin')
@UseGuards(JwtAuthGuard)
@Controller("roles")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}


  @Post()
  @ApiBody({type: CreateRoleDto})
  async createRole(@Body() roleData: CreateRoleDto) {
    return await this.roleService.createRole(roleData);
  }

  @Get(":id")
  async getRoleById(@Param("id", new ParseUUIDPipe()) roleId: string) {
    return await this.roleService.getRoleById(roleId);
  }


  @Get()
  async getAllRoles() {
    return await this.roleService.getAllRoles();
  }


  @Put(":id")
  @ApiBody({ type: UpdateRoleDto })
  async updateRole(
    @Param("id", new ParseUUIDPipe()) roleId: string,
    @Body() updatedRoleData: UpdateRoleDto
  ) {
    return await this.roleService.updateRole(roleId, updatedRoleData);
  }


  @Delete(":id")
  async deleteRole(@Param("id", new ParseUUIDPipe()) roleId: string) {
    return await this.roleService.deleteRole(roleId);
  }
}
