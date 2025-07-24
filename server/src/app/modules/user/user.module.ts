import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'build-team-queue',
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
   exports:[UserService],
})
export class UserModule {}
