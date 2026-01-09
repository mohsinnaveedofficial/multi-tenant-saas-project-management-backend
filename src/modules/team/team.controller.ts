import { Controller, Get, Req } from '@nestjs/common';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
    constructor(private readonly teamServices:TeamService){}

    @Get("dashboard")
    dashboard(@Req() req){
        return this.teamServices.dashboard(req.user.id)

    }

    @Get("report")
    report(@Req() req){
        return this.teamServices.reportPage(req.user.id)

    }
}
