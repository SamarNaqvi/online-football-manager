import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { TeamService } from "./team.service";

@Controller("teams")
export class TeamController{
    constructor(private teamService: TeamService){}

    @Get()
    async getTeam(@Query('email') email : string){
        return await this.teamService.getTeam(email);
    }
}