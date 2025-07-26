import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from "@nestjs/common";
import { TeamService } from "./team.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller("teams")
export class TeamController{
    constructor(private teamService: TeamService){}

    @UseGuards(AuthGuard)
    @Get()
    async getTeam(@Query('email') email : string){
        return await this.teamService.getTeam(email);
    }
}