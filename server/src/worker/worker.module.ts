import { Module } from '@nestjs/common';
import { WorkerService } from './worker.processor';
import { BullModule } from '@nestjs/bullmq';
import { TeamModule } from '../app/modules/team/team.module';
import { UserModule } from '../app/modules/user/user.module';
import { FirebaseModule } from '../app/modules/firebase/firebase.module';

@Module({
  imports: [
     BullModule.forRoot({
      connection: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      },
    }),
    BullModule.registerQueue({
      name: 'build-team-queue',
      connection: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      },
    }),
    TeamModule,
    UserModule,
    FirebaseModule
  ],
  providers: [WorkerService],
})
export class WorkerModule {}