import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'build-team-queue',
      processors: [],
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
