import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { GetStaff, Public } from 'src/configs/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/sign-in')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.phone, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/sign-up')
  signUp(@Body() signInDto: Record<string, any>) {
    return this.authService.signUp(
      signInDto.phone,
      signInDto.password,
      signInDto.name,
    );
  }

  @UseGuards(AuthGuard)
  @Get('/get-me')
  getMe(@GetStaff() staff: any) {
    console.log("🚀 ~ AuthController ~ getMe ~ staff:", staff)
    return staff;
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
