import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import { ZodValidationPipe } from 'src/app/pipes/zod-validation-pipe';
import { AuthGuard } from '../auth/auth.guard';
import {
  BuyPlayerSchema,
  buyPlayerSchema,
  PlayerQuerySchema,
  playerQuerySchema,
  playerUpdateStatusSchema,
  PlayerUpdateStatusSchema,
} from './player.schema';
import { PlayerService } from './player.service';

@UseGuards(AuthGuard)
@Controller('players')
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Get('transfer-list')
  @UsePipes(new ZodValidationPipe(playerQuerySchema))
  async getTransferListPlayers(@Query() query: PlayerQuerySchema) {
    return {
      players: await this.playerService.getPlayersInTransferList(
        query?.teamName,
        query.playerName,
        query.price,
      ),
    };
  }

  @Put('change-status')
  @UsePipes(new ZodValidationPipe(playerUpdateStatusSchema))
  async changePlayerStatus(@Req() request: Request, @Body() updateData: PlayerUpdateStatusSchema) {
    const { playerId, askingPrice, status } = updateData;
    const email = (request as any).user?.email;
  
    return await this.playerService.changeTransferListStatus(
      playerId,
      status,
      askingPrice,
      email
    );
  }

  @Put('buy-player')
  @UsePipes(new ZodValidationPipe(buyPlayerSchema))
  async buyPlayer(@Req() request: Request, @Body() data: BuyPlayerSchema) {
    const { teamId, playerTeamId, playerId } = data;
    const email = (request as any).user?.email;

    return await this.playerService.buyPlayer(
      teamId,
      playerTeamId,
      playerId,
      email,
    );
  }
}
