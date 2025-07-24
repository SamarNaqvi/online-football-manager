import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUser } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    @InjectQueue('build-team-queue') private audioQueue: Queue,
  ) {}
  async createUser(data: CreateUser) {
    const user = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });
    if (user) {
      return user;
    } else {
      const user = await this.prismaService.user.create({data});
      await this.audioQueue.add('build-team-queue',{
        userId: user.id
      });
      return user;
    }
  }

  async getUserToken(userId:number){
    return await this.prismaService.user.findUnique({where:{id:userId}, select:{token:true}});
  }
}
