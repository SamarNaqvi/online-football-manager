import { Body, Controller, Get,Post, Query, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { CreateUser, createUserSchema } from "./user.schema";
import { UserService } from "./user.service";
import { FirebaseService } from "../firebase/firebase.service";

@Controller("users")
export class UserController{
    constructor(private userService: UserService, private firebaseService: FirebaseService){

    }

    @Post("login")
    @UsePipes(new ZodValidationPipe(createUserSchema))
    async register(@Body() data: CreateUser){
       return {data: await this.userService.createUser(data)};
    }

   @Get('run')
  async runLoop() {
    const token = "cwA0-dB58i6ywUaVyZjGi6:APA91bHX4AIzXS1hYFz8IyHJA_rE5-9touHOR4AVje1T4PqjodNmrgBfnQFqmP44fi7DrgQHNXjvuvGmsJs4P4hcMINTcVWUIHSyu4bSywYa7KCmbZW1r-s";
    const payload = {
      notification: {
        title: 'New Notification',
        body: "hello samar",
      },
    };
    const result = await this.firebaseService.sendNotification(token, payload);
    return { result };
  }



}