import { FirebaseService } from './../firebase/firebase.service';
import { UserService } from './../user/user.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlayerService {
  constructor(private prismaService: PrismaService, private userService: UserService, private firebaseService: FirebaseService) {}

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
    userEmail: string,
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

     await this.prismaService.player.update({
      where: { id: playerId },
      data: queryData,
    });

   const tokens = await this.userService.getAllTokens(userEmail);
    const payload = {
      notification: {
        title: 'New Player Notification',
        body: `Hello, New Player ${playerStatus ? 'added to' : 'removed from'} Transfer Market.`,
      },
      data: {
        type: 'change-status',
      },
    };
    if (tokens) this.firebaseService.sendNotificationMulti(tokens.map(token=>token?.token), payload);
  }

  async buyPlayer(teamId: number, playerTeamId: number, playerId: number, userEmail:string) {
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
        const updatedCount = await client.player.updateMany({
          where: { id: playerId, isOnTransferList: true },
          data: { teamId, isOnTransferList: false, askingPrice: 0 },
        });

        if (updatedCount.count === 0) {
          throw new ForbiddenException(
            'Cannot Buy Player either it is not on Transfer List or already purchased',
          );
        }

        await client.team.update({
          where: { id: teamId },
          data: { budget: newTeamBudget },
        });

        await client.team.update({
          where: { id: playerTeamId },
          data: { budget: newPlayerTeamBudget },
        });
      });
    const token = await this.userService.getUserToken({email:userEmail});
    const payload = {
      notification: {
        title: 'Buy Player Notification',
        body: `Hello, New Player Added to Your Team, Please try visting Team Page View`,
      },
      data: {
        type: 'buy-player',
      },
    };
    if (token?.token) this.firebaseService.sendNotification(token?.token, payload);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
