import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlayerService {
  constructor(private prismaService: PrismaService) {}

  async getPlayersInTransferList(
    teamName: string,
    playerName: string,
    price: number,
  ) {
    const query = { isOnTransferList: true };
    if (teamName && teamName !== '') {
      query['team'] = { name: teamName };
    }
    if (price && price >= 0) {
      query['price'] = price;
    }

    if (playerName && playerName !== '') {
      query['name'] = playerName;
    }

    const playerWithTeamName = await this.prismaService.player.findMany({
      where: query,
      include: {
        team: { select: { name: true, user: { select: { email: true } } } },
      },
    });
    return playerWithTeamName;
  }

  async changeTransferListStatus(
    playerId: number,
    playerStatus: boolean,
    askingPrice: number,
  ) {
    // Checking if removing player would leave team with less than 15 players
    if (!playerStatus) { 
      const player = await this.prismaService.player.findUnique({
        where: { id: playerId },
        include: { team: { include: { players: true } } },
      });

      if (player?.team?.players && player.team.players.length <= 15) {
        throw new ForbiddenException('Teams must have at least 15 players');
      }
    }

    const queryData = { isOnTransferList: playerStatus };
    if (askingPrice >= 0) {
      queryData['askingPrice'] = askingPrice;
    }

    return await this.prismaService.player.update({
      where: { id: playerId },
      data: queryData,
    });
  }

  async buyPlayer(teamId: number, playerTeamId: number, playerId: number) {
    try {
      const team = await this.prismaService.team.findUnique({
        where: { id: teamId },
        include: { players: true },
      });
      const playerTeam = await this.prismaService.team.findUnique({
        where: { id: playerTeamId },
      });
      const player = await this.prismaService.player.findUnique({
        where: { id: playerId },
      });

      if (!team || !playerTeam || !player) {
        throw new ForbiddenException('Unable to find Entities');
      }

      if (team.players?.length >= 25) {
        throw new ForbiddenException("Teams can't have more than 25 players");
      }

      const askingPrice = Number(player.askingPrice);
      if (isNaN(askingPrice) || askingPrice <= 0) {
        throw new ForbiddenException('Player asking price is invalid');
      }

      const playerPrice = askingPrice * 0.95;
      const newTeamBudget = Number(team.budget) - playerPrice;
      const newPlayerTeamBudget = Number(playerTeam.budget) + playerPrice;

      if (newTeamBudget < 0) {
        throw new ForbiddenException(
          "You can't buy this player due to insufficient budget",
        );
      }

      await this.prismaService.$transaction(async (client) => {
        await client.player.update({
          where: { id: playerId },
          data: { teamId, isOnTransferList: false, askingPrice: 0 },
        });

        await client.team.update({
          where: { id: teamId },
          data: { budget: newTeamBudget },
        });

        await client.team.update({
          where: { id: playerTeamId },
          data: { budget: newPlayerTeamBudget },
        });
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
