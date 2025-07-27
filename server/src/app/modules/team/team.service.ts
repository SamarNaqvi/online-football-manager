import { Injectable } from '@nestjs/common';
import { ROLE_REQUIREMENTS } from '../../constant';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamService {
  constructor(private prismaService: PrismaService) {}

  async createTeam(userId: string) {
    try {
      const team = await this.prismaService.team.create({
        data: {
          userId: parseInt(userId),
          name: `Team ${userId}`,
        },
      });

      const [goalkeepers, defenders, midfielders, forwards] = await Promise.all(
        [
          this.prismaService.player.findMany({
            where: { role: 'GOALKEEPER', teamId: null },
            take: ROLE_REQUIREMENTS.GOALKEEPER,
          }),
          this.prismaService.player.findMany({
            where: { role: 'DEFENDER', teamId: null },
            take: ROLE_REQUIREMENTS.DEFENDER,
          }),
          this.prismaService.player.findMany({
            where: { role: 'MIDFIELDER', teamId: null },
            take: ROLE_REQUIREMENTS.MIDFIELDER,
          }),
          this.prismaService.player.findMany({
            where: { role: 'FORWARD', teamId: null },
            take: ROLE_REQUIREMENTS.FORWARD,
          }),
        ],
      );

      const players = [
        ...goalkeepers,
        ...defenders,
        ...midfielders,
        ...forwards,
      ];
      const updatedBudget = players?.reduce((total, curr) => {
        const newVal = total - Number(curr.price);
        return newVal;
      }, Number(team?.budget));

      const teamWithPlayers = await this.prismaService.team.update({
        where: { id: team?.id },
        data: {
          players: {
            connect: players.map((player) => ({ id: player.id })),
          },
          budget: updatedBudget,
          status: 'DONE',
        },
      });

      return { team: teamWithPlayers, players, success: true };
    } catch (exception) {
      console.log('Team creation failed: ', exception);

      const team = await this.prismaService.team.findUnique({
        where: { userId: parseInt(userId) },
      });

      if (team) {
        await this.prismaService.team.update({
          where: { userId: parseInt(userId) },
          data: { status: 'FAILED' },
        });
      }

      return { team: {}, players: [], success: false };
    }
  }

  async getTeam(email: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    const team = await this.prismaService.team.findUnique({
      where: { userId: user?.id },
    });
    if (!team) {
      return { players: [], team: {status: 'PENDING'} };
    }
    const players = await this.prismaService.player.findMany({
      where: { teamId: team?.id },
    });
    return { players, team:{...team} };
  }
}
