import { Module } from '@nestjs/common';

import { ConsumerService } from './worker.processor';
import { BullModule } from '@nestjs/bullmq';
import { TeamModule } from '../app/modules/team/team.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'build-team-queue',
      connection: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      },
    }),
    TeamModule,
  ],
  providers: [ConsumerService],
})
export class WorkerModule {}