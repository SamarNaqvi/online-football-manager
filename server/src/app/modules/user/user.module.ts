import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BullModule } from '@nestjs/bullmq';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../constant';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'build-team-queue',
    }),
     JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30s' },
    }),
  ],

  providers: [UserService],
  controllers: [UserController],
   exports:[UserService],
})
export class UserModule {}
