import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  SetMetadata,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateTenantDto } from '../tenant/dto/create-tenant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { UserRole } from './enums/user-role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { AddTeamDto } from './dto/add-team.dto';
import { ParamUUIDPipe } from 'src/common/pipes/param-uuid.pipe';
import { UpdateTeamDto } from './dto/update-team.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto,createTenantDto:CreateTenantDto) {
  //   return this.userService.create(createUserDto,createTenantDto);
  // }

  @Get('profile')
  getProfile(@Req() req) {
    return this.userService.findOne(req.user.id);
  }

  @Roles(UserRole.ADMIN)
  @Get('')
  findAllUser(@Req() req) {
    return this.userService.findAll(req.user.id);
  }

  //  @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findByEmail(id);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @UseGuards(RolesGuard)
  // @UseGuards(JwtAuthGuard)

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', new ParamUUIDPipe()) id: string, @Req() req) {
    return this.userService.remove(id, req.user.id);
  }

  @Roles(UserRole.ADMIN)
  @Post('addUser')
  AddUser(@Req() req, @Body() addTeamDto: AddTeamDto) {
    return this.userService.AddUser(req.user.id, addTeamDto);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', new ParamUUIDPipe()) id: string,
    @Body() updateTemaDto: UpdateTeamDto,
    @Req() req,
  ) {
    return this.userService.UpdateUser(id, updateTemaDto, req.user.id);
  }


  @Get("/team/profile")
  getTeamProfile(@Req() req){
    
    return this.userService.getProfile(req.user.id)
  }
}
