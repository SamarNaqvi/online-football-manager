import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { CreateUser, createUserSchema } from './user.schema';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async register(@Body() data: CreateUser) {
    return await this.userService.createUser(data);
  }
}
