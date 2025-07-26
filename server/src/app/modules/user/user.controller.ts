import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { CreateUser, createUserSchema } from './user.schema';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UserController {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async register(@Body() data: CreateUser) {
    
    const res = await this.userService.createUser(data);
    const payload = { sub: res.id, email: res.email };
    return { access_token: await this.jwtService.signAsync(payload), ...res};
  }
}
