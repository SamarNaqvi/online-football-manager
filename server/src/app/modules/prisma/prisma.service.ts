import { Injectable, type OnModuleInit } from '@nestjs/common';
import { Player, PrismaClient } from '@prisma/client';
import path from 'path';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  /* istanbul ignore next */
  async onModuleInit(): Promise<void> {
    await this.$connect();
    await this.runSeed();
  }

  async runSeed() {
    const playerCount = await this.player.count();
    if (playerCount == 0) {
      console.log(
        '\n----------------Seeding DataBase With Players--------------------',
      );
      const { players } = await import(`../../../../prisma/seed/players`);
      const createPromises = players.map((playerData) =>
        this.player.create({ data: playerData }),
      );
      await Promise.all(createPromises);
      console.log(`\n--------------Seeded ${players.length} players successfully.-----------------`);
    }
  }
}
