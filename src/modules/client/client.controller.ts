import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { UserRole } from '../user/enums/user-role.enum';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createClientDto: CreateClientDto, @Req() req) {
    return this.clientService.create(createClientDto,req.user.id);
  }


  @Get()
  findAll(@Req() req) {
    return this.clientService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(+id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto,@Req() req) {
    return this.clientService.update(id, updateClientDto,req.user.id);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string ,@Req() req) {
    return this.clientService.remove(id,req.user.id);
  }
}
