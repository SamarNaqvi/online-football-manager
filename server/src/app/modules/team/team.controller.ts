import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { TeamService } from "./team.service";

@Controller("teams")
export class TeamController{
    constructor(private teamService: TeamService){}

    @Get("/:id")
    async getTeam(@Param('id', ParseIntPipe) id : number){
        return await this.teamService.getTeam(id);
    }
}