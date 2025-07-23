import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TeamService {
  constructor(private prismaService: PrismaService) {}

  async createTeam(userId: string) {
    const [goalkeepers, defenders, midfielders, forwards] = await Promise.all([
      this.prismaService.player.findMany({
        where: { role: 'GOALKEEPER', teamId: null },
        take: 3,
      }),
      this.prismaService.player.findMany({
        where: { role: 'DEFENDER', teamId: null },
        take: 6,
      }),
      this.prismaService.player.findMany({
        where: { role: 'MIDFIELDER', teamId: null },
        take: 6,
      }),
      this.prismaService.player.findMany({
        where: { role: 'FORWARD', teamId: null },
        take: 5,
      }),
    ]);
    const players = [...goalkeepers, ...defenders, ...midfielders, ...forwards];
    const teamWithPlayers = await this.prismaService.team.create({
      data: {
        name: `Team ${userId}`,
        userId: parseInt(userId),
        players: {
          connect: players.map((player) => ({ id: player.id })),
        },
      },
    });

    return { team: teamWithPlayers, players };
  }

  async getTeam(teamId: number){
    const team = await this.prismaService.team.findUnique({where:{id:teamId}});
    const players = await this.prismaService.player.findMany({where:{teamId:teamId}});
    
    return {players, team};
  }
}
