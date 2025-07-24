import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { TeamModule } from './modules/team/team.module';
import { UserModule } from './modules/user/user.module';
import { BullModule } from '@nestjs/bullmq';
import { FirebaseModule } from './modules/firebase/firebase.module';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    FirebaseModule,
       BullModule.forRootAsync({
      useFactory: () => ({
        connection: {
          url: process.env.REDIS_URL || 'redis://localhost:6379',
        },
      }),
    }),
    
    TeamModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
