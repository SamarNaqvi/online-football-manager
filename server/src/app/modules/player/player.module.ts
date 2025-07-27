import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { UserModule } from '../user/user.module';

@Module({
    imports:[UserModule],
    providers:[PlayerService],
    controllers:[PlayerController]
})
export class PlayerModule {}
