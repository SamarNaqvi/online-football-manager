import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Patch,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { PlayerService } from './player.service';
import { ZodValidationPipe } from 'src/app/pipes/zod-validation-pipe';
import {
  BuyPlayerSchema,
  buyPlayerSchema,
  PlayerQuerySchema,
  playerQuerySchema,
  playerUpdateStatusSchema,
  PlayerUpdateStatusSchema,
} from './player.schema';
import { AuthGuard } from '../auth/auth.guard';

@Controller('players')
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Put('change-status')
  @UsePipes(new ZodValidationPipe(playerUpdateStatusSchema))
  async changePlayerStatus(@Body() updateData: PlayerUpdateStatusSchema) {
    const { playerId, askingPrice, status } = updateData;
    return await this.playerService.changeTransferListStatus(
      playerId,
      status,
      askingPrice,
    );
  }

  @UseGuards(AuthGuard)
  @Put('buy-player')
  @UsePipes(new ZodValidationPipe(buyPlayerSchema))
  async buyPlayer(@Body() data: BuyPlayerSchema) {
    const { teamId, playerTeamId, playerId } = data;
    return await this.playerService.buyPlayer(teamId, playerTeamId, playerId);
  }
}
